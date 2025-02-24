import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./component/Providers";



export const metadata: Metadata = {
  title: "Counter App",
  description: "Counter App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Providers >
        {children}
        </Providers>
      
      </body>
    </html>
  );
}
