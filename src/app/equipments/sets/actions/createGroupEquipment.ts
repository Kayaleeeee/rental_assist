import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { PriceItemStateType } from "../../modules/PriceSettingModal/PriceSettingModal";
import {
  EquipmentListItemType,
  SetEquipmentItemPostPayload,
  SetEquipmentPayload,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import {
  createSetEquipmentItemList,
  postSetEquipment,
} from "@/app/api/equipments/setEquipments";

import { postGroupEquipmentPrice } from "@/app/api/equipments/equipmentPrice";

export const createGroupEquipment = async ({
  form,
  priceList,
  equipmentList,
}: {
  form: SetEquipmentPayload;
  priceList: PriceItemStateType[];
  equipmentList: EquipmentListItemType[];
}) => {
  const validForm = validateForm({ form, priceList, equipmentList });

  if (!validForm) throw new Error("Invalid form");

  const setCreateResult = await postSetEquipment(validForm.form);
  const convertedSetEquipmentList: SetEquipmentItemPostPayload[] =
    convertEquipmentToPayload(validForm.equipmentList, setCreateResult.id);

  await createSetEquipmentItemList(convertedSetEquipmentList);

  await postGroupEquipmentPrice(
    validForm.priceList.map((item) => ({ ...item, setId: setCreateResult.id }))
  );
};

const validateForm = ({
  form,
  priceList,
  equipmentList,
}: {
  form: SetEquipmentPayload;
  priceList: PriceItemStateType[];
  equipmentList: EquipmentListItemType[];
}) => {
  if (isEmpty(form.title)) {
    showToast({
      message: "세트명을 입력해주세요.",
      type: "error",
    });
    return null;
  }

  if (isEmpty(priceList)) {
    showToast({
      message: "렌탈 가격을 입력해주세요.",
      type: "error",
    });
    return null;
  }

  if (isEmpty(equipmentList)) {
    showToast({ message: "장비를 추가해주세요.", type: "error" });
    return null;
  }

  return {
    form,
    equipmentList,
    priceList,
  };
};

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
