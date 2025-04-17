import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Menu } from "@components/Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Cart } from "./components/Cart";
import { ModalProvider } from "./components/Modal/useModal";

const notoSansKR = localFont({
  src: [
    {
      path: "./fonts/NotoSansKR-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansKR-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Rental Assist - 편리한 장비 렌탈 관리",
  description: "장비 렌탈 운영을 더 쉽고 스마트하게! 🎥",
  icons: {
    icon: "./icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansKR.className}`}>
        <ModalProvider>
          <ToastContainer
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <div className="mainWrapper">
            <aside>
              <Menu />
            </aside>
            <div className="childrenWrapper">{children}</div>
          </div>
          <Cart />
          <div id="modal-root" />
        </ModalProvider>
      </body>
    </html>
  );
}
