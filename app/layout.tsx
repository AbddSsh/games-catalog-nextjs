import type { Metadata, Viewport } from "next";
import "@/shared/styles/globals.scss";

export const metadata: Metadata = {
  title: {
    default: "GameSite",
    template: "%s | GameSite",
  },
  description: "Free Online Games",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e17",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
