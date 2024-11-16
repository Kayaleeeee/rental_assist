import { PaymentStatus } from "@/app/types/reservationType";
import { useMemo } from "react";

export const PaymentStatusText = ({ status }: { status: PaymentStatus }) => {
  const color = useMemo(() => {
    switch (status) {
      case PaymentStatus.unpaid:
        return "#f3260c";
      case PaymentStatus.refunded:
        return "#ff8522";
      default:
        return "#009cd8";
    }
  }, [status]);
  return (
    <div
      style={{
        color,
        fontWeight: 700,
      }}
    >
      {getPaymentStatusText(status)}
    </div>
  );
};

const getPaymentStatusText = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.paid:
      return "결제완료";
    case PaymentStatus.unpaid:
      return "미결제";
    case PaymentStatus.refunded:
      return "환불";
    default:
      return "결제완료";
  }
};
