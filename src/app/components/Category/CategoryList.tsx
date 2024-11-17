import { ReactElement } from "react";
import styles from "./category.module.scss";

interface CategoryMenu {
  key: string;
  title: string | ReactElement;
}

type Props = {
  categoryList: CategoryMenu[];
  selectedCategory?: string;
  onChangeCategory: (key: CategoryMenu["key"]) => void;
};

export const CategoryList = ({
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
            <b>{item.title}</b>
          </div>
        );
      })}
    </div>
  );
};
