import { postEquipmentForm, editEquipment } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty, isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const categoryMenu = EquipmentCategoryList;

export const useEquipmentForm = () => {
  const router = useRouter();
  const [category, setCategory] = useState<{
    key: EquipmentCategory;
    title: string;
  }>(categoryMenu[0]);

  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const onChangeCategory = (key: string) => {
    const selectedCategoryIndex = categoryMenu.findIndex(
      (item) => item.key === key
    );

    if (selectedCategoryIndex === -1) return;

    setCategory(categoryMenu[selectedCategoryIndex]);
  };

  const getIsValidForm = useCallback(() => {
    if (isEmpty(title)) {
      showToast({
        message: "장비명을 입력해주세요.",
        type: "error",
      });
      return false;
    }

    if (isNil(price)) {
      showToast({
        message: "렌탈 가격을 입력해주세요.",
        type: "error",
      });
      return;
    }

    if (isEmpty(category.key)) {
      showToast({
        message: "카테고리를 선택해주세요.",
        type: "error",
      });
      return false;
    }

    return true;
  }, [title, price, category]);

  const submitEquipmentForm = useCallback(async () => {
    if (!getIsValidForm()) return;

    const form: EquipmentPostBody = {
      category: category.key,
      title,
      price,
      detail,
      memo,
      quantity,
    };

    try {
      await postEquipmentForm(form);
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
  }, [category, title, price, detail, router, memo, quantity, getIsValidForm]);

  const editEquipmentForm = useCallback(
    async (id: EquipmentListItemType["id"]) => {
      if (!getIsValidForm()) return;

      const form: EquipmentPostBody = {
        category: category.key,
        title,
        price,
        detail,
        memo,
        quantity,
      };

      try {
        await editEquipment(id, form);
        showToast({
          message: "장비가 수정되었습니다.",
          type: "success",
        });
        router.push("/equipments");
      } catch (e) {
        console.log("등록 실패", e);
        showToast({
          message: "장비 수정에 실패했습니다.",
          type: "error",
        });
      }
    },
    [category, quantity, title, price, detail, router, memo, getIsValidForm]
  );

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
    editEquipmentForm,
    memo,
    setMemo,
    setQuantity,
    quantity,
  };
};
