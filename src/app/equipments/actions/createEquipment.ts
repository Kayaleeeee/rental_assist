import { EquipmentPostBody } from "@/app/types/equipmentType";
import { PriceItemStateType } from "../modules/PriceSettingModal/PriceSettingModal";
import { isEmpty } from "lodash";
import { showToast } from "@/app/utils/toastUtils";
import { postEquipmentForm } from "@/app/api/equipments";
import { postEquipmentPrice } from "@/app/api/equipments/equipmentPrice";

export const createEquipment = async ({
  form,
  priceList,
}: {
  form: EquipmentPostBody;
  priceList: PriceItemStateType[];
}) => {
  const validForm = validateForm({ form, priceList });

  if (!validForm) throw new Error("Invalid form");

  const { id } = await postEquipmentForm(validForm.form);

  await postEquipmentPrice(
    validForm.priceList.map((item) => ({ ...item, equipmentId: id }))
  );
};

const validateForm = ({
  form,
  priceList,
}: {
  form: EquipmentPostBody;
  priceList: PriceItemStateType[];
}) => {
  if (isEmpty(form.title)) {
    showToast({
      message: "장비명을 입력해주세요.",
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

  if (isEmpty(form.category)) {
    showToast({
      message: "카테고리를 선택해주세요.",
      type: "error",
    });
    return null;
  }

  return {
    form: form,
    priceList,
  };
};
