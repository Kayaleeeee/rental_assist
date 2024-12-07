import { EquipmentListItemState } from "@/app/store/useCartStore";
import { EquipmentPriceItem } from "../equipmentPriceType";

export const mapEquipmentStateWithPrice = (
  itemList: EquipmentListItemState[],
  priceList: EquipmentPriceItem[]
): EquipmentListItemState[] => {
  const priceIndex = priceList.findIndex((price) => {
    return itemList.some((item) => item.id === price.equipmentId);
  });

  return itemList.map((item) => {
    if (priceIndex === -1) {
      return { ...item, price: 0 };
    } else {
      return { ...item, price: priceList[priceIndex].price };
    }
  });
};
