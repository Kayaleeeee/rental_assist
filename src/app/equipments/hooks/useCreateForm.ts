import { createEquipment } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const categoryMenu = [
  { key: EquipmentCategory.camera, title: "카메라" },
  { key: EquipmentCategory.accessary, title: "악세서리" },
];

export const useCreateForm = () => {
  const router = useRouter();
  const [category, setCategory] = useState<{
    key: EquipmentCategory;
    title: string;
  }>(categoryMenu[0]);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");

  const onChangeCategory = (key: string) => {
    const selectedCategoryIndex = categoryMenu.findIndex(
      (item) => item.key === key
    );

    if (selectedCategoryIndex === -1) return;

    setCategory(categoryMenu[selectedCategoryIndex]);
  };

  const submitEquipmentForm = useCallback(async () => {
    const form: EquipmentPostBody = {
      category: category.key,
      title,
      price,
      detail,
    };

    try {
      await createEquipment(form);
      router.push("/equipments");
    } catch (e) {
      console.log("등록 실패", e);
    }
  }, [category, title, price, detail]);

  return {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    price,
    setPrice,
    detail,
    setDetail,
    submitEquipmentForm,
  };
};
