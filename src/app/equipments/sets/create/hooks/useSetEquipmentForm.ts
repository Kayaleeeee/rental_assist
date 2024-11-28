import {
  createEquipmentSet,
  createEquipmentSetItemList,
} from "@/app/api/equipments/setEquipments";
import {
  EquipmentListItemType,
  SetEquipmentItemPostPayload,
  SetEquipmentPayload,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty, isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const useSetEquipmentForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const [equipmentList, setEquipmentList] = useState<EquipmentListItemType[]>(
    []
  );

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

    return true;
  }, [title, price]);

  const submitEquipmentSetForm = useCallback(async () => {
    if (!getIsValidForm()) return;

    const form: SetEquipmentPayload = {
      title,
      price,
      detail,
    };

    try {
      const setCreateResult = await createEquipmentSet(form);

      const convertedSetEquipmentList: SetEquipmentItemPostPayload[] =
        equipmentList.map((item) => {
          return {
            equipmentId: item.id,
            quantity: item.quantity,
            setId: setCreateResult.id,
          };
        });

      const listCreateResult = await createEquipmentSetItemList(
        convertedSetEquipmentList
      );

      console.log(listCreateResult);

      showToast({
        message: "장비가 등록되었습니다.",
        type: "success",
      });

      router.push("/equipments");
    } catch (e) {
      console.log("등록 실패", e);
      showToast({
        message: "풀 세트 장비 등록에 실패했습니다.",
        type: "error",
      });
    }
  }, [title, price, detail, router, memo, getIsValidForm, equipmentList]);

  return {
    title,
    setTitle,
    price,
    setPrice,
    detail,
    setDetail,
    memo,
    setMemo,
    submitEquipmentSetForm,
    equipmentList,
    setEquipmentList,
  };
};
