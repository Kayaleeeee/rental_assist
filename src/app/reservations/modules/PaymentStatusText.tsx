import { PaymentStatus } from "@/app/types/reservationType";
import { useMemo } from "react";

export const PaymentStatusText = ({
  status,
  size,
}: {
  status: PaymentStatus;
  size?: number;
}) => {
  const color = useMemo(() => {
    switch (status) {
      case PaymentStatus.unpaid:
        return "#f3260c";
      case PaymentStatus.refunded:
        return "#ff8522";
      case PaymentStatus.paid:
        return "#009cd8";
      default:
        return "#f3260c";
    }
  }, [status]);

  return (
    <div
      style={{
        color,
        fontWeight: 700,
        fontSize: size || 14,
      }}
    >
      {getPaymentStatusText(status)}
    </div>
  );
};

export const getPaymentStatusText = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.paid:
      return "결제완료";
    case PaymentStatus.unpaid:
      return "미결제";
    case PaymentStatus.refunded:
      return "환불";
    default:
      return "미결제";
  }
};
