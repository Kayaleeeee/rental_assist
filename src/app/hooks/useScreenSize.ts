import { useEffect, useState } from "react";

const MENU_WIDTH = 200;
const CONTENT_PADDING = 24;

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(0);
  const [screenMode, setScreenMode] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenSize(window.innerWidth);
      const isMobile = window.innerWidth <= 768;
      setScreenMode(isMobile ? "mobile" : "desktop");
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenSize,
    screenMode,
    contentSize: screenSize - MENU_WIDTH - CONTENT_PADDING * 2,
  };
};
