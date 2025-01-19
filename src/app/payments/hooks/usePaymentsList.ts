import { getPaymentsSumUp } from "@/app/api/payments/paymentsApi";
import { getReservationList } from "@/app/api/reservation";
import { PaymentSumUpPostPayload } from "@/app/types/paymentType";
import {
  PaymentStatus,
  ReservationSearchParams,
  ReservationStatus,
  ReservationType,
} from "@/app/types/reservationType";

import { showToast } from "@utils/toastUtils";
import dayjs from "dayjs";
import { useCallback, useState } from "react";

const allString = "all";
const paymentStatusCategoryList = [
  {
    key: allString,
    title: "전체",
  },
  {
    key: PaymentStatus.unpaid,
    title: "미결제",
  },
  {
    key: PaymentStatus.paid,
    title: "결제 완료",
  },
  {
    key: PaymentStatus.refunded,
    title: "환불",
  },
];

const periodCategoryList = [
  {
    key: 1,
    title: "1개월",
  },
  {
    key: 3,
    title: "3개월",
  },
  {
    key: 6,
    title: "6개월",
  },
  {
    key: 12,
    title: "1년",
  },
  {
    key: 36,
    title: "3년",
  },
];

const initialSumUpState = {
  paid: 0,
  unpaid: 0,
  refunded: 0,
};

export const usePaymentList = () => {
  const [list, setList] = useState<ReservationType[]>([]);
  const [selectedPaymentCategory, setSelectedPaymentCategory] =
    useState<string>(paymentStatusCategoryList[0].key);

  const [selectedPeriod, setSelectedPeriod] = useState<number>(
    periodCategoryList[0].key
  );
  const [pageModel, setPageModel] = useState({
    offset: 0,
    limit: 50,
  });
  const [sumUpState, setSumUpState] = useState<{
    [key: string]: number;
  }>(initialSumUpState);

  const getDateRangeByPeriod = useCallback((period: number) => {
    const today = dayjs();
    const dateByPeriod = today.subtract(period - 1, "months").startOf("month");

    return {
      startDate: dateByPeriod.toISOString(),
      endDate: today.endOf("month").toISOString(),
    };
  }, []);

  const getParamsByPeriod = useCallback(
    (period: number) => {
      const { startDate, endDate } = getDateRangeByPeriod(period);

      return {
        startDate: `lte.${endDate}`,
        endDate: `gte.${startDate}`,
      };
    },
    [getDateRangeByPeriod]
  );

  const getSearchParams = useCallback(
    (params = {}): ReservationSearchParams => {
      const defaultParams = {
        ...pageModel,
        order: "id.desc",
        status: `in.(${ReservationStatus.confirmed})`,
      };

      const dateParams = getParamsByPeriod(selectedPeriod);

      const categoryParams =
        selectedPaymentCategory === paymentStatusCategoryList[0].key
          ? {}
          : { paymentStatus: selectedPaymentCategory };

      return {
        ...defaultParams,
        ...categoryParams,
        ...dateParams,
        ...params,
      };
    },
    [selectedPeriod, selectedPaymentCategory, pageModel, getParamsByPeriod]
  );

  const getSumUpParams = useCallback(
    (params?: Partial<PaymentSumUpPostPayload>): PaymentSumUpPostPayload => {
      const { startDate, endDate } = getDateRangeByPeriod(selectedPeriod);

      return {
        startDateParam: startDate,
        endDateParam: endDate,
        paymentStatusParam:
          selectedPaymentCategory === paymentStatusCategoryList[0].key
            ? null
            : (selectedPaymentCategory as PaymentStatus),
        ...params,
      };
    },
    [selectedPeriod, selectedPaymentCategory, getDateRangeByPeriod]
  );

  const fetchReservationList = useCallback(
    async (params?: ReservationSearchParams) => {
      try {
        const result = await getReservationList(params);
        setList(result.data);
      } catch {
        showToast({
          message: "예약 목록을 불러오는데 실패했습니다.",
          type: "error",
        });
      }
    },
    []
  );

  const fetchPaymentSumUp = useCallback(
    async (params: PaymentSumUpPostPayload) => {
      try {
        const result = await getPaymentsSumUp(params);
        const payment: { [key: string]: number } = {};

        result.forEach((item) => {
          payment[item.paymentStatus] = item.totalAmount;
        });

        setSumUpState((prev) => ({ ...prev, ...payment }));
      } catch {
        setSumUpState(initialSumUpState);
      }
    },
    []
  );

  const onChangeStatusCategory = (key: string) => {
    setSelectedPaymentCategory(key);
    const paymentStatus =
      key === paymentStatusCategoryList[0].key ? undefined : key;
    const searchParams = getSearchParams({
      paymentStatus,
    });
    const sumUpParams = getSumUpParams({
      paymentStatusParam: paymentStatus || null,
    });

    fetchReservationList(searchParams);
    fetchPaymentSumUp(sumUpParams);
  };

  const onChangePeriodCategory = (key: number) => {
    setSelectedPeriod(key);
    const dateParams = getParamsByPeriod(key);
    const searchParams = getSearchParams(dateParams);
    const dateByPeriod = getDateRangeByPeriod(key);
    const sumUpParams = getSumUpParams({
      startDateParam: dateByPeriod.startDate,
      endDateParam: dateByPeriod.endDate,
    });

    fetchReservationList(searchParams);
    fetchPaymentSumUp(sumUpParams);
  };

  return {
    sumUpState,
    list,
    setList,
    paymentStatusCategoryList,
    selectedPaymentCategory,
    periodCategoryList,
    selectedPeriod,
    onChangeStatusCategory,
    onChangePeriodCategory,
    fetchReservationList,
    getSearchParams,
    setPageModel,
    getDateRangeByPeriod,
    getSumUpParams,
    fetchPaymentSumUp,
  };
};
