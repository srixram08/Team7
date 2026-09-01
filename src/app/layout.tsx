import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Automated Rollback System — ReviveX Online Examination Platform",
  description: "Automated Rollback Engine for Online Examination Systems featuring 100Hz telemetry monitoring, 2.4s instant state recovery, digital twin shadow synchronization, and SHA-256 cryptographic hash verification.",
  keywords: [
    "Automated Rollback Engine",
    "Online Examination System",
    "State Recovery",
    "Digital Twin Synchronization",
    "Fault Tolerant Exams",
    "Zero Data Loss Assessment"
  ],
  authors: [{ name: "ReviveX Core Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FFFFFF] text-[#0E1E33] antialiased selection:bg-[#00A8FF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
