import {
  EquipmentGroupPriceItem,
  EquipmentPriceItem,
} from "@/app/types/equipmentPriceType";
import { PriceItemStateType } from "../modules/PriceSettingModal/PriceSettingModal";
import { isEmpty, isEqual, isNil } from "lodash";
import {
  postEquipmentPrice,
  deleteEquipmentPriceList,
  patchEquipmentPriceItem,
} from "@/app/api/equipments/equipmentPrice";

export const updatePriceList = async (
  id: EquipmentPriceItem["equipmentId"],
  list: PriceItemStateType[],
  originalList: EquipmentPriceItem[]
) => {
  const { updateList, deleteList, createList } = getListByType(
    list,
    originalList
  );

  if (!isEmpty(createList)) {
    await postEquipmentPrice(
      createList.map((item) => ({ ...item, equipmentId: id }))
    );
  }

  if (!isEmpty(deleteList)) {
    await deleteEquipmentPriceList(deleteList.map((item) => item.id).join(","));
  }

  if (!isEmpty(updateList)) {
    await Promise.all(
      updateList.map((item) => {
        patchEquipmentPriceItem(item.id, {
          day: item.day,
          price: item.price,
          equipmentId: id,
        });
      })
    );
  }
};

const getListByType = (
  list: PriceItemStateType[],
  originalList: EquipmentPriceItem[]
) => {
  const updateList: {
    id: EquipmentPriceItem["id"] | EquipmentGroupPriceItem["id"];
    day: number;
    price: number;
  }[] = [];
  const createList: PriceItemStateType[] = [];
  const deleteList: PriceItemStateType[] = originalList.filter(
    (originalItem) => !list.some((item) => item.id === originalItem.id)
  );

  list.forEach((item) => {
    if (isNil(item.id)) {
      createList.push(item);
      return;
    }

    if (item.id) {
      const originalItem = originalList.find(
        (originalItem) => originalItem.id === item.id
      );

      if (isEqual(originalItem, item)) return;

      updateList.push({
        ...item,
        id: item.id,
      });
    }
  });

  return { updateList, deleteList, createList };
};
