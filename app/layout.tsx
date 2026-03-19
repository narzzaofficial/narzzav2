import type { Metadata } from "next";
import "./globals.css";
import { RouteProgress } from "@/components/frontend/RouteProgress";
import { ThemeProvider } from "@/components/frontend/ThemeProvider";

export const metadata: Metadata = {
  title: "Narzza Media Digital",
  description: "Berita, tutorial, dan eksperimen dalam format chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RouteProgress />
          <div className="min-h-screen bg-canvas">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
