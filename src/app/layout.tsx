import TopBar from "@/components/layout/Topbar";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopBar/>
        <Navbar /> 

        <main>{children}</main>

       {/** <Footer />*/} 
      </body>
    </html>
  );
}