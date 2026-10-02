import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
export const metadata = { title: "ShopSnap", description: "Phone photo in, professional catalog out." };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}<SpeedInsights /></body></html>);
}
