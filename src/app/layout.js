import { Kumbh_Sans, Fira_Code } from "next/font/google";
import PropTypes from "prop-types";

import Footer from "@/components/Footer";

const sansFont = Kumbh_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-sans" });
const monoFont = Fira_Code({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Kabir Ke Dohe API",
  description: "An API for fetching and filtering Kabir's dohas (couplets)",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${monoFont.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
