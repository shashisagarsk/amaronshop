import "./globals.css";
import Header from "./component/header";
import Footer from "./component/footer";

export const metadata = {
  title: "AmronShop",
  description: "Responsive Shop Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
