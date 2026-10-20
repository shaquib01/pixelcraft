import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelCraft — Create something beautiful",
  description: "A simple creative studio for images and text."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
