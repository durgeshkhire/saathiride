import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen gradient-mesh flex flex-col relative overflow-hidden noise-overlay">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/[0.07] rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-accent/[0.05] rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-primary/[0.04] rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Navbar />
      <main className="flex-1 pt-16 relative z-[1]">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
