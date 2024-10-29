import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./index.module.scss";

type Props = PropsWithChildren<{
  size: "Small" | "Medium" | "Large";
}> &
  HTMLAttributes<HTMLButtonElement>;

export const Button = (props: Props) => {
  const getStyle = () => {
    if (props.size === "Small") return styles.smallButton;
    if (props.size === "Medium") return styles.mediumButton;
    return styles.largeButton;
  };

  return (
    <button className={getStyle()} {...props}>
      {props.children}
    </button>
  );
};
