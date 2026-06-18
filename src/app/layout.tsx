import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ScreenGuard } from "@/components/ui/ScreenGuard";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coffee Time",
  description: "Manual de recetas Coffee Time",
};

// overlays-content: the software keyboard appears OVER the content without
// resizing the viewport. This prevents any layout shift when the keyboard
// opens — identical to native app behavior on iOS 16+ and Chrome 108+.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "overlays-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} antialiased`}>
      <body>
        <ScreenGuard />
        {children}
      </body>
    </html>
  );
}
