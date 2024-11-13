import { EquipmentListItemType } from "@/app/types/equipmentType";
import { useState } from "react";

export const useQuoteForm = () => {
  const [form, setForm] = useState<{
    startDateTime: string | undefined;
    endDateTime: string | undefined;
    equipmentList: EquipmentListItemType[];
  }>({
    startDateTime: undefined,
    endDateTime: undefined,
    equipmentList: [],
  });

  const onChangeForm = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    form,
    onChangeForm,
  };
};
