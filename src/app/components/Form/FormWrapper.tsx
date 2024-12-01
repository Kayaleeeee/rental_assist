import { PropsWithChildren } from "react";
import styles from "./index.module.scss";
import { FormLoader } from "./FormLoader";

type Props = PropsWithChildren<{
  title?: string;
  width?: string;
  maxWidth?: string;
  isLoading?: boolean;
}>;

export const FormWrapper = ({ isLoading = false, ...props }: Props) => {
  return (
    <div
      className={styles.formWrapper}
      style={{
        width: props.width,
        maxWidth: props.maxWidth,
      }}
    >
      {props.title && <h1 className={styles.title}>{props.title}</h1>}
      {isLoading ? <FormLoader /> : <div>{props.children}</div>}
    </div>
  );
};
