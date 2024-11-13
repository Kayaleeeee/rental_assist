import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./index.module.scss";

type Props = PropsWithChildren<{
  size: "Small" | "Medium" | "Large";
  variant?: "outlined" | "filled" | "text";
}> &
  HTMLAttributes<HTMLButtonElement>;

export const Button = (props: Props) => {
  const getSize = () => {
    if (props.size === "Small") return styles.smallButton;
    if (props.size === "Medium") return styles.mediumButton;
    return styles.largeButton;
  };

  const getStyle = () => {
    if (props.variant === "outlined") return styles.outlinedButton;
    if (props.variant === "text") return styles.textButton;
    return styles.filledButton;
  };

  return (
    <button className={`${getSize()} ${getStyle()}`} {...props}>
      {props.children}
    </button>
  );
};
