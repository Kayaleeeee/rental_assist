import { getPaymentList, getPaymentsSumUp } from "@/app/api/payments";
import { PageModelType } from "@/app/types/listType";
import {
  PaymentListItemType,
  PaymentListSearchParams,
  PaymentSumUpPostPayload,
} from "@/app/types/paymentType";
import { PaymentStatus, ReservationStatus } from "@/app/types/reservationType";

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

const searchMenu = [{ key: "userName", title: "회원이름" }];

export const usePaymentList = () => {
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [list, setList] = useState<PaymentListItemType[]>([]);
  const [selectedPaymentCategory, setSelectedPaymentCategory] =
    useState<string>(paymentStatusCategoryList[0].key);

  const [selectedPeriod, setSelectedPeriod] = useState<number>(
    periodCategoryList[0].key
  );
  const [pageModel, setPageModel] = useState({
    offset: 0,
    limit: 50,
  });
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sumUpState, setSumUpState] = useState<{
    [key: string]: number;
  }>(initialSumUpState);
  const [keyword, setKeyword] = useState<string>("");

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
        startDate,
        endDate,
      };
    },
    [getDateRangeByPeriod]
  );

  const getSearchParams = useCallback(
    (params = {}): PaymentListSearchParams => {
      const defaultParams = {
        ...pageModel,
        status: ReservationStatus.confirmed,
      };

      const dateParams = getParamsByPeriod(selectedPeriod);

      const paymentStatus =
        selectedPaymentCategory === paymentStatusCategoryList[0].key
          ? {}
          : { paymentStatus: selectedPaymentCategory };

      const keywordParams =
        keyword && selectedSearchKey ? { [selectedSearchKey]: keyword } : {};

      return {
        ...defaultParams,
        ...paymentStatus,
        ...dateParams,
        ...params,
        ...keywordParams,
      };
    },
    [
      selectedPeriod,
      selectedPaymentCategory,
      pageModel,
      getParamsByPeriod,
      keyword,
      selectedSearchKey,
    ]
  );

  const onChangeSearchKey = (key: string) => {
    setSelectedSearchKey(key);
  };

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

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

  const fetchPaymentList = useCallback(
    async (params?: PaymentListSearchParams) => {
      try {
        const result = await getPaymentList(params);
        setList(result.data);
        setTotalElements(result.totalElements);
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

    fetchPaymentList(searchParams);
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

    fetchPaymentList(searchParams);
    fetchPaymentSumUp(sumUpParams);
  };

  const onChangePage = useCallback(
    (pageModel: PageModelType) => {
      setPageModel(pageModel);
      fetchPaymentList(getSearchParams(pageModel));
    },
    [fetchPaymentList, getSearchParams]
  );

  return {
    sumUpState,
    list,
    setList,
    paymentStatusCategoryList,
    selectedPaymentCategory,
    periodCategoryList,
    selectedPeriod,
    totalElements,
    pageModel,
    searchMenu,
    keyword,
    selectedSearchKey,
    onChangeStatusCategory,
    onChangePeriodCategory,
    fetchPaymentList,
    getSearchParams,
    setPageModel,
    getDateRangeByPeriod,
    getSumUpParams,
    fetchPaymentSumUp,
    onChangePage,
    onChangeSearchKey,
    onChangeKeyword,
  };
};
