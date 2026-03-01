import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Interactive AI Training Visualizer",
  description: "Real-time neural network training simulator dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <ThemeProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl" />
            </div>
            <main className="relative z-10">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

