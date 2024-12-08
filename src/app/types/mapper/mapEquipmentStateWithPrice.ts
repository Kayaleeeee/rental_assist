import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import {
  EquipmentPriceItemByRound,
  GroupPriceItemByRound,
} from "../equipmentPriceType";

export const mapEquipmentStateWithPrice = (
  itemList: EquipmentListItemState[],
  priceList: EquipmentPriceItemByRound[]
): EquipmentListItemState[] => {
  const priceIndex = priceList.findIndex((price) => {
    return itemList.some((item) => item.equipmentId === price.equipmentId);
  });

  return itemList.map((item) => {
    if (priceIndex === -1) {
      return { ...item, price: 0 };
    } else {
      return { ...item, price: priceList[priceIndex].price };
    }
  });
};

export const mapEquipmentGroupStateWithPrice = (
  groupList: SetEquipmentStateType[],
  priceList: GroupPriceItemByRound[]
): SetEquipmentStateType[] => {
  const priceIndex = priceList.findIndex((price) => {
    return groupList.some((item) => item.setId === price.setId);
  });

  return groupList.map((item) => {
    if (priceIndex === -1) {
      return { ...item, price: 0 };
    } else {
      return { ...item, price: priceList[priceIndex].price };
    }
  });
};
