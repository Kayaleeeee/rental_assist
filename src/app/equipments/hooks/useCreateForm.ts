import { createEquipment } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const categoryMenu = EquipmentCategoryList;

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
      showToast({
        message: "장비가 등록되었습니다.",
        type: "success",
      });
      router.push("/equipments");
    } catch (e) {
      console.log("등록 실패", e);
      showToast({
        message: "장비가 등록에 실패했습니다.",
        type: "error",
      });
    }
  }, [category, title, price, detail, router]);

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
