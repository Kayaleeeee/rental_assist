import { getReservationDetail } from "@/app/api/reservation";
import { CustomError } from "@/app/class/CustomError";
import {
  PaymentMethod,
  PaymentStatus,
  ReservationStatus,
  ReservationType,
} from "@/app/types/reservationType";
import { clientSupabase } from "@/app/utils/supabase/client";
import { isEmpty } from "lodash";

export type UpdatePaymentPayload = {
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
};

export const updatePayment = async ({
  reservationId,
  body,
}: {
  reservationId: ReservationType["id"];
  body: UpdatePaymentPayload;
}): Promise<{
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}> => {
  // reservation status check
  // 확정인 경우에만 payment 변경 가능하도록

  const reservation = await getReservationDetail(reservationId);

  if (reservation.status !== ReservationStatus.confirmed)
    throw new CustomError(
      "예약상태가 확정인 경우에만 결제상태를 변경 할 수 있습니다."
    );

  const payload = {
    reservation_id: reservationId,
    payment_status: body.paymentStatus,
    payment_method:
      body.paymentStatus === PaymentStatus.unpaid ? null : body.paymentMethod,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await clientSupabase
    .from("payments")
    .upsert(payload, {
      onConflict: "reservation_id",
    })
    .select();

  if (error) throw new CustomError(error.message);

  if (isEmpty(data)) throw new CustomError("변경사항이 없습니다");
  return {
    paymentMethod: data[0].payment_method,
    paymentStatus: data[0].payment_status,
  };
};
