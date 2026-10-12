import type { Metadata } from "next";
import "./globals.css";
import "./refinements.css";
import "./cinema.css";
export const metadata: Metadata = {
  title: "EPOCH — The Time Machine",
  description:
    "Scroll backward through the story of Earth, humanity, and existence. An immersive living archive across 4.54 billion years.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
