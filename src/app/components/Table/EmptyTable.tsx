import styles from "./index.module.scss";

type Props = {
  height?: number;
  title?: string;
};

export const EmptyTable = ({ height = 300, title }: Props) => {
  return (
    <div
      className={styles.emptyTableWrapper}
      style={{
        height: `${height}px`,
      }}
    >
      {title || "내역이 존재하지 않습니다."}
    </div>
  );
};
