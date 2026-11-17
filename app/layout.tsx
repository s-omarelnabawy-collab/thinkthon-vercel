import type { Metadata } from "next";
import "./globals.css";
import { registrationDeadline } from "./registration-deadline";

export const metadata: Metadata = {
  title: "THINKTHON 2026 | Circuits Edition",
  description: `Enter the IEEE Zewail City Student Branch circuits competition on November 23 and 30. Individual registration closes ${registrationDeadline.date}.`,
  icons: { icon: "/thinkthon-icon.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
