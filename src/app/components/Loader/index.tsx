import { HtmlHTMLAttributes } from "react";
import styles from "./index.module.scss";

type Props = {
  size?: number;
  mode?: "dark" | "light";
};

export const Loader = ({ size = 30, mode }: Props) => {
  const style = {
    "--size": `${size}px` || "10px",
    "--color": mode === "dark" ? "var(--primary)" : "#fff",
  } as HtmlHTMLAttributes<HTMLDivElement>["style"];

  return <div className={styles.loader} style={style} />;
};
