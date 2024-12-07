import { useState } from "react";

export type ReservationFormState = {
  userId?: number;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice: number;
  rounds: number;
};

export const useReservationForm = () => {
  const [form, setForm] = useState<ReservationFormState>({
    userId: undefined,
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
    rounds: 0,
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
