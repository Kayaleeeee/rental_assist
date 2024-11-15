import styles from "./errorMessage.module.scss";

type Props = { message: string };

export const ErrorMessage = ({ message }: Props) => {
  return <div className={styles.messageWrapper}>{message}</div>;
};
