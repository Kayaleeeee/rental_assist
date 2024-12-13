import { ReactElement } from "react";
import styles from "./category.module.scss";

interface CategoryMenu<T extends React.Key> {
  key: T;
  title: string | ReactElement;
}

type Props<T extends React.Key> = {
  categoryList: CategoryMenu<T>[];
  selectedCategory?: T;
  onChangeCategory: (key: T) => void;
  type?: "shadow" | "borderless";
  gap?: string;
};

export const CategoryList = <T extends React.Key>({
  categoryList = [],
  selectedCategory,
  onChangeCategory,
  type = "shadow",
  gap,
}: Props<T>) => {
  return (
    <div
      className={type === "shadow" ? styles.wrapper : styles.borderlessWrapper}
      style={{
        gap,
      }}
    >
      {categoryList.map((item, index) => {
        return (
          <div
            key={item.key || index}
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
