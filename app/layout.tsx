import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// @ts-ignore: side-effect import of CSS module declaration missing
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SolangeSublime",
  description: "Tienda kawaii anime aesthetic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}