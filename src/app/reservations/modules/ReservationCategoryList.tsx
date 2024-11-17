import { Margin } from "@/app/components/Margin";
import styles from "./reservationCategoryList.module.scss";

type Props = {
  categoryList: { key: string; title: string; count: number }[];
  selectedCategory: string;
  onChangeCategory: (key: string) => void;
};

export const ReservationCategoryList = ({
  categoryList,
  selectedCategory,
  onChangeCategory,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      {categoryList.map((item) => {
        return (
          <div
            key={item.key}
            onClick={() => onChangeCategory(item.key)}
            className={
              selectedCategory === item.key
                ? styles.activeCategoryItem
                : styles.categoryItem
            }
          >
            <Margin right={5}>
              <b>{item.title}</b>
            </Margin>
            {item.key !== "all" && `(${item.count})`}
          </div>
        );
      })}
    </div>
  );
};
