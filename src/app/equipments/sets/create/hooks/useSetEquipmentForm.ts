import {
  createSetEquipmentItemList,
  deleteSetEquipmentItemList,
  editSetEquipment,
} from "@/app/api/equipments/setEquipments";
import {
  EquipmentListItemType,
  SetEquipmentItemPostPayload,
  SetEquipmentType,
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
  const [disabled, setDisabled] = useState<boolean>(false);
  const [equipmentList, setEquipmentList] = useState<EquipmentListItemType[]>(
    []
  );

  const validateForm = useCallback(() => {
    if (isEmpty(title)) {
      showToast({
        message: "세트명을 입력해주세요.",
        type: "error",
      });
      return false;
    }

    if (isEmpty(equipmentList)) {
      showToast({ message: "장비를 추가해주세요.", type: "error" });
      return false;
    }

    return true;
  }, [title, price, equipmentList]);

  const onEditSetEquipment = useCallback(
    async (
      setId: SetEquipmentType["id"],
      originEquipmentList: EquipmentListItemType[]
    ) => {
      if (!validateForm()) return;

      const originEquipmentIdList = originEquipmentList.map((item) => item.id);

      try {
        await editSetEquipment(setId, {
          title,
          price,
          detail,
          memo,
          disabled,
        });

        const setEquipmentIdList: SetEquipmentItemPostPayload[] =
          equipmentList.map((item) => ({
            equipmentId: item.id,
            setId,
            quantity: item.quantity,
          }));

        await deleteSetEquipmentItemList(originEquipmentIdList.join(","));

        await createSetEquipmentItemList(setEquipmentIdList);
        showToast({
          message: "풀세트 정보가 수정되었습니다.",
          type: "success",
        });

        router.replace(`/equipments/sets/${setId}`);
      } catch {
        showToast({
          message: "수정에 오류가 발생했습니다.",
          type: "error",
        });
      }
    },
    [router, validateForm, equipmentList, disabled]
  );

  return {
    title,
    setTitle,
    price,
    setPrice,
    detail,
    setDetail,
    memo,
    setMemo,
    onEditSetEquipment,
    equipmentList,
    setEquipmentList,
    disabled,
    setDisabled,
  };
};
