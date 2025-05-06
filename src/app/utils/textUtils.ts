export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

export const parseOnlyNumber = (string: string) => {
  return string.replace(/[^0-9]/g, "");
};
export const addPaddingZero = (value: number) => {
  return String(value).padStart(2, "0");
};
