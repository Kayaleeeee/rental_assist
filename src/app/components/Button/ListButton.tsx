import { HtmlHTMLAttributes, PropsWithChildren } from "react";
import styles from "./listButton.module.scss";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

type Props = {
  title?: string;
} & HtmlHTMLAttributes<HTMLButtonElement>;

export const ListButton = (props: PropsWithChildren<Props>) => {
  return (
    <button className={styles.wrapper} {...props}>
      <ArrowBackRoundedIcon sx={{ marginRight: "4px", color: "#529aff" }} />
      {props.title || props.children}
    </button>
  );
};
