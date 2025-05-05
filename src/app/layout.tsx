'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/components/AppContext";
import { ThemeProvider } from "@/components/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen flex flex-col justify-center items-center`}
      >
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
		>
			<AppContextProvider>
				{children}
			</AppContextProvider>
		</ThemeProvider>
      </body>
    </html>
  );
}
