import { useState } from "react";

export type ReservationFormState = {
  userId?: string;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice: number;
};

export const useReservationForm = () => {
  const [form, setForm] = useState<ReservationFormState>({
    userId: undefined,
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
  });

  const onChangeForm = (
    key: keyof ReservationFormState,
    value: ReservationFormState[keyof ReservationFormState]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    form,
    setForm,
    onChangeForm,
  };
};
