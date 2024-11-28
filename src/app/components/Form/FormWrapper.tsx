import { PropsWithChildren } from "react";
import styles from "./index.module.scss";

type Props = PropsWithChildren<{
  title?: string;
  width?: string;
  maxWidth?: string;
}>;

export const FormWrapper = (props: Props) => {
  return (
    <div
      className={styles.formWrapper}
      style={{
        width: props.width,
        maxWidth: props.maxWidth,
      }}
    >
      {props.title && <h1 className={styles.title}>{props.title}</h1>}
      <div>{props.children}</div>
    </div>
  );
};
