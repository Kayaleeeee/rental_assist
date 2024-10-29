import styles from "./index.module.scss";

type Props = {
  title: string;
};

export const Label = ({ title }: Props) => {
  return <div className={styles.label}>{title}</div>;
};
