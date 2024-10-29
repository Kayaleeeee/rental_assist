import { PropsWithChildren } from "react";
import styles from "./index.module.scss";

type Props = PropsWithChildren<{
  title?: string;
}>;

export const FormWrapper = (props: Props) => {
  return (
    <div className={styles.formWrapper}>
      {props.title && <h1 className={styles.title}>{props.title}</h1>}
      <div>{props.children}</div>
    </div>
  );
};
