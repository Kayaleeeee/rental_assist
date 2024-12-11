import { HTMLAttributes, PropsWithChildren, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { Loader } from "../Loader";

type Props = PropsWithChildren<{
  size: "Small" | "Medium" | "Large";
  variant?: "outlined" | "filled" | "text";
  color?: string;
  onClick?: () => void | Promise<void>;
}> &
  HTMLAttributes<HTMLButtonElement>;

export const Button = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const style = { ...props.style, "--button-color": props.color };
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

  const loaderSize = useMemo(() => {
    if (props.size === "Small") return 15;
    if (props.size === "Medium") return 20;
    if (props.size === "Large") return 25;
  }, [props.size]);

  const loaderMode = useMemo(() => {
    if (props.variant === "filled") return "light";
    return "dark";
  }, [props.variant]);

  return (
    <button
      className={`${getSize()} ${getStyle()}`}
      {...props}
      style={style}
      onClick={async () => {
        if (props.onClick) {
          setIsLoading(true);
          await props.onClick();
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? (
        <Loader size={loaderSize} mode={loaderMode} />
      ) : (
        props.children
      )}
    </button>
  );
};
