import { useCallback, useState } from "react";

const categoryMenu = [
  { key: "camera", title: "카메라" },
  { key: "accessary", title: "악세서리" },
];

export const useCreateForm = () => {
  const [category, setCategory] = useState<{ key: string; title: string }>(
    categoryMenu[0]
  );
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const onChangeCategory = (key: string) => {
    const selectedCategoryIndex = categoryMenu.findIndex(
      (item) => item.key === key
    );

    if (selectedCategoryIndex === -1) return;

    setCategory(categoryMenu[selectedCategoryIndex]);
  };

  const submitEquipmentForm = useCallback(() => {
    const form = {
      category,
      title,
      price,
    };

    console.log(form);
  }, []);

  return {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    price,
    setPrice,
    submitEquipmentForm,
  };
};
