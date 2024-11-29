import {
  createSetEquipment,
  createSetEquipmentItemList,
  deleteSetEquipmentItemList,
  editSetEquipment,
} from "@/app/api/equipments/setEquipments";
import {
  EquipmentListItemType,
  SetEquipmentItemPostPayload,
  SetEquipmentPayload,
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

    if (isNil(price)) {
      showToast({
        message: "렌탈 가격을 입력해주세요.",
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

  const convertEquipmentToPayload = (
    equipmentList: EquipmentListItemType[],
    setId: SetEquipmentType["id"]
  ) => {
    return equipmentList.map((item) => {
      return {
        equipmentId: item.id,
        quantity: item.quantity,
        setId,
      };
    });
  };

  const onCreateSetEquipment = useCallback(async () => {
    if (!validateForm()) return;

    const form: SetEquipmentPayload = {
      title,
      price,
      detail,
    };

    try {
      const setCreateResult = await createSetEquipment(form);

      const convertedSetEquipmentList: SetEquipmentItemPostPayload[] =
        convertEquipmentToPayload(equipmentList, setCreateResult.id);

      await createSetEquipmentItemList(convertedSetEquipmentList);

      showToast({
        message: "풀 세트 장비가 등록되었습니다.",
        type: "success",
      });

      router.push("/equipments/sets");
    } catch (e) {
      console.log("등록 실패", e);
      showToast({
        message: "풀 세트 장비 등록에 실패했습니다.",
        type: "error",
      });
    }
  }, [title, price, detail, router, memo, validateForm, equipmentList]);

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
    [router, validateForm, equipmentList]
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
    onCreateSetEquipment,
    equipmentList,
    setEquipmentList,
  };
};
