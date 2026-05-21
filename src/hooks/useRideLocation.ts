import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface LocationUpdate {
  rideId: string;
  lat: number;
  lng: number;
  driverName?: string;
  timestamp?: string;
}

export function useRideLocation(
  rideId: string,
  role: "DRIVER" | "PASSENGER",
  isOngoing: boolean,
  driverName?: string
) {
  const [driverLocation, setDriverLocation] = useState<LocationUpdate | null>(null);
  const clientRef = useRef<Client | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOngoing) return;

    // Use SockJS connection since standard WebSocket URL won't work out of the box with Spring WebSocket setup
    const socket = new SockJS("http://13.232.83.99:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // Uncomment to debug STOMP traffic
        // console.log("STOMP: ", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket for live location tracking.");

      if (role === "PASSENGER") {
        stompClient.subscribe(`/topic/ride/${rideId}/location`, (message) => {
          if (message.body) {
            console.log("Received location update:", message.body);
            const loc: LocationUpdate = JSON.parse(message.body);
            setDriverLocation(loc);
          }
        });
      }
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    stompClient.activate();
    clientRef.current = stompClient;

    if (role === "DRIVER") {
      if ("geolocation" in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const update: LocationUpdate = {
              rideId,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              driverName,
              timestamp: new Date().toISOString(),
            };

            setDriverLocation(update); // Update locally as well

            if (stompClient.connected) {
              stompClient.publish({
                destination: `/app/location/${rideId}`,
                body: JSON.stringify(update),
              });
            }
          },
          (err) => console.error("Geolocation error: ", err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.error("Geolocation not supported by this browser.");
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [rideId, role, isOngoing, driverName]);

  return { driverLocation };
}
