import { PaymentMethod } from "@/app/types/reservationType";
import { useMemo } from "react";
import { mapPaymentMethodName } from "../utils/paymentMethodNameUtils";

export const PaymentMethodText = ({
  paymentMethod,
  size,
}: {
  paymentMethod: PaymentMethod;
  size?: number;
}) => {
  const color = useMemo(() => {
    switch (paymentMethod) {
      case PaymentMethod.bank_transfer:
        return "var(--primary)";
      case PaymentMethod.cash:
        return "var(--green)";
      case PaymentMethod.card:
        return "var(--blue-1)";
      default:
        return "#009cd8";
    }
  }, [paymentMethod]);

  return (
    <div
      style={{
        color,
        fontWeight: 700,
        fontSize: size || 14,
      }}
    >
      {mapPaymentMethodName(paymentMethod)}
    </div>
  );
};
