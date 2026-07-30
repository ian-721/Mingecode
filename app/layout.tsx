import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "命格译码｜非生产 Demo",
  description: "用生辰和三道小问题，看看你习惯怎么把事情往前推。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
