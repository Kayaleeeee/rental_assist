import { getGroupEquipmentPriceList } from "@/app/api/equipments/equipmentPrice";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";

export const useGroupEquipmentPriceList = () => {
  const fetchGroupPriceList = async (id: EquipmentListItemType["id"]) => {
    try {
      return await getGroupEquipmentPriceList(id);
    } catch (e) {
      showToast({
        message: "가격 정보를 불러오는데 실패했습니다.",
        type: "error",
      });
      throw e;
    }
  };

  return { fetchGroupPriceList };
};
