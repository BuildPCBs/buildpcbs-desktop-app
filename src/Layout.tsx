import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Weight 400
import "@fontsource/inter/700.css"; // Weight 700
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans text-slate-900 antialiased h-screen flex flex-col">
      {children}
    </div>
  );
}
