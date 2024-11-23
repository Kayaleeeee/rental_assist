import { useEffect, useState } from "react";

const MENU_WIDTH = 200;
const CONTENT_PADDING = 24;
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenSize,
    contentSize: screenSize - MENU_WIDTH - CONTENT_PADDING * 2,
  };
};
