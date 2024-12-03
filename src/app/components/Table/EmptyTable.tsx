import styles from "./index.module.scss";

type Props = {
  height?: string;
  title?: string;
};

export const EmptyTable = ({ height = "300px", title }: Props) => {
  return (
    <div
      className={styles.emptyTableWrapper}
      style={{
        height,
      }}
    >
      {title || "내역이 존재하지 않습니다."}
    </div>
  );
};
