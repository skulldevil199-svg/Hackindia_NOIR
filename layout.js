import "./globals.css";
export const metadata = { title: "ShopSnap", description: "Phone photo in, professional catalog out." };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
