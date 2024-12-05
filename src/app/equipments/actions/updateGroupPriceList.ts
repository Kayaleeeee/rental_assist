import { EquipmentGroupPriceItem } from "@/app/types/equipmentPriceType";
import { PriceItemStateType } from "../modules/PriceSettingModal/PriceSettingModal";
import { isEmpty, isEqual, isNil } from "lodash";
import {
  postGroupEquipmentPrice,
  patchGroupEquipmentPriceItem,
  deleteGroupEquipmentPriceList,
} from "@/app/api/equipments/equipmentPrice";
import { SetEquipmentType } from "@/app/types/equipmentType";

export const updateGroupPriceList = async (
  id: SetEquipmentType["id"],
  list: PriceItemStateType[],
  originalList: EquipmentGroupPriceItem[]
) => {
  const { updateList, deleteList, createList } = getListByType(
    list,
    originalList
  );

  if (!isEmpty(createList)) {
    await postGroupEquipmentPrice(
      createList.map((item) => ({ ...item, setId: id }))
    );
  }

  if (!isEmpty(deleteList)) {
    await deleteGroupEquipmentPriceList(
      deleteList.map((item) => item.id).join(",")
    );
  }

  if (!isEmpty(updateList)) {
    await Promise.all(
      updateList.map((item) => {
        patchGroupEquipmentPriceItem(item.id, {
          day: item.day,
          price: item.price,
          setId: id,
        });
      })
    );
  }
};

const getListByType = (
  list: PriceItemStateType[],
  originalList: EquipmentGroupPriceItem[]
) => {
  const updateList: {
    id: EquipmentGroupPriceItem["id"];
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
        id: item.id,
        day: item.day,
        price: item.price,
      });
    }
  });

  return { updateList, deleteList, createList };
};
