import { useState } from "react";

export const useQuoteForm = () => {
  const [form, setForm] = useState<{
    startDateTime: string | undefined;
    endDateTime: string | undefined;
  }>({
    startDateTime: undefined,
    endDateTime: undefined,
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
