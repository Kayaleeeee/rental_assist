import { PaymentMethod } from "@/app/types/reservationType";

export const mapPaymentMethodName = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.bank_transfer:
      return "계좌 이체";
    case PaymentMethod.card:
      return "카드";
    case PaymentMethod.cash:
      return "현금 결제";
  }
};
