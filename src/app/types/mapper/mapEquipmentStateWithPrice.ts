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
  return itemList.map((item) => {
    const priceIndex = priceList.findIndex(
      (price) => price.equipmentId === item.equipmentId
    );

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
  return groupList.map((item) => {
    const priceIndex = priceList.findIndex(
      (price) => price.setId === item.setId
    );

    if (priceIndex === -1) {
      return { ...item, price: 0 };
    } else {
      return { ...item, price: priceList[priceIndex].price };
    }
  });
};
