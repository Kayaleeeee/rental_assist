import { isNil } from "lodash";

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
  if (isNil(number)) return "-";
  return number.toLocaleString("ko-KR");
};

const getMultiplier = (day: number) => {
  const priceRatioList = [
    1, 1.8, 2.55, 3.2, 3.75, 4.2, 4.69, 5.12, 5.58, 6, 6.49, 6.96, 7.41, 7.84,
    8.25, 8.64, 9.01, 9.36, 9.69, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14,
    14.5, 15,
  ];

  return day > priceRatioList.length
    ? priceRatioList.length * 0.5
    : priceRatioList[day - 1];
};

export const calculatePrices = (startPrice: number, days: number) => {
  const prices = []; // 일반가를 저장할 배열

  for (let day = 1; day <= days; day++) {
    const multiplier = getMultiplier(day);
    const price = Math.round(startPrice * multiplier); // 소수점 반올림
    prices.push({ day, price }); // 날짜와 가격 저장
  }

  return prices;
};
