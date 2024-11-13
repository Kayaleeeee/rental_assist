export function formatKoreanCurrency(amount: number): string {
  if (amount >= 100000000) {
    return `${Math.floor(amount / 100000000)}억 ${formatKoreanCurrency(
      amount % 100000000
    )}`;
  } else if (amount >= 10000) {
    return `${Math.floor(amount / 10000)}만 ${formatKoreanCurrency(
      amount % 10000
    )}`;
  } else if (amount >= 1000) {
    return `${Math.floor(amount / 1000)}천 ${formatKoreanCurrency(
      amount % 1000
    )}`;
  } else if (amount >= 100) {
    return `${Math.floor(amount / 100)}백 ${formatKoreanCurrency(
      amount % 100
    )}`;
  } else {
    return `${amount > 0 ? amount : ""}원`;
  }
}

export const formatLocaleString = (number: number) => {
  return number.toLocaleString("ko-KR");
};
