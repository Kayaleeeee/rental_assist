"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../page.module.scss";

import { EditableField } from "@/app/components/EditableField";
import { Label } from "@/app/components/Form/Label";
import { Button } from "@/app/components/Button";
import { useEquipmentDetail } from "./hooks/useEquipmentDetail";
import { useParams, useRouter } from "next/navigation";
import {
  EquipmentCategoryList,
  EquipmentItemWithRentedDates,
} from "@/app/types/equipmentType";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListButton } from "@/app/components/Button/ListButton";
import { Margin } from "@/app/components/Margin";
import {
  CalendarEventType,
  MonthCalendar,
} from "@/app/components/Calendar/MonthCalendar";
import { useEquipmentRentalDates } from "../hooks/useEquipmentRentalDates";
import dayjs from "dayjs";
import { deleteEquipment } from "@/app/api/equipments";
import { showToast } from "@/app/utils/toastUtils";
import { getPaddingDateRange } from "@/app/utils/timeUtils";
import { PriceListTable } from "../modules/PriceSettingModal/PriceSettingModal";
import { useEquipmentPriceList } from "./hooks/useEquipmentPriceList";
import { EquipmentPriceItem } from "@/app/types/equipmentPriceType";
import { isEmpty } from "lodash";

const convertToEventList = (rentalInfo: EquipmentItemWithRentedDates[]) => {
  const eventList: CalendarEventType[] = [];

  if (!rentalInfo) return [];

  rentalInfo.forEach((item) => {
    item.rentedDates.forEach((date) => {
      eventList.push({
        start: dayjs(date.startDate).toDate(),
        end: dayjs(date.endDate).toDate(),
        title: item.userName,
        id: item.reservationId,
      });
    });
  });
  return eventList;
};

const EquipmentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const equipmentId = Number(params.id);
  const { detail: equipmentDetail } = useEquipmentDetail(equipmentId);
  const [rentalInfo, setRentalInfo] = useState<EquipmentItemWithRentedDates[]>(
    []
  );
  const [priceList, setPriceList] = useState<EquipmentPriceItem[]>([]);
  const originalPriceList = useRef<EquipmentPriceItem[]>([]);

  const [currentDate, setCurrentDate] = useState(dayjs());

  const { fetchSingleEquipmentRentalHistory } = useEquipmentRentalDates();
  const { fetchPriceList } = useEquipmentPriceList();

  const eventDateList: CalendarEventType[] = useMemo(() => {
    return isEmpty(rentalInfo) ? [] : convertToEventList(rentalInfo);
  }, [rentalInfo]);

  const selectedCategory = useMemo(() => {
    if (!equipmentDetail) return "";

    return (
      EquipmentCategoryList.find(
        (item) => item.key === equipmentDetail.category
      )?.title || ""
    );
  }, [equipmentDetail]);

  const handleFetchPriceList = useCallback((id: number) => {
    fetchPriceList(id)
      .then((response) => {
        setPriceList(response);
        originalPriceList.current = response;
      })
      .catch(() => setPriceList([]));
  }, []);

  const handleDeleteEquipment = useCallback(async () => {
    if (!equipmentDetail || !equipmentId) return;

    if (!confirm("장비를 삭제하시겠습니까?")) return;

    try {
      await deleteEquipment(equipmentId);

      showToast({ message: "장비를 삭제했습니다", type: "success" });
      router.push(`/equipments`);
    } catch {
      showToast({ message: "장비를 삭제할 수 없습니다.", type: "error" });
    }
  }, [equipmentDetail, equipmentId, router]);

  useEffect(() => {
    if (!equipmentId || !currentDate) return;

    const { startDate, endDate } = getPaddingDateRange(currentDate, 15, "day");

    fetchSingleEquipmentRentalHistory({
      equipmentId,
      startDate,
      endDate,
    }).then((result) => setRentalInfo(result));
  }, [currentDate, equipmentId]);

  useEffect(() => {
    if (!equipmentId || isNaN(equipmentId)) return;

    handleFetchPriceList(equipmentId);
  }, [equipmentId, handleFetchPriceList]);

  if (!equipmentDetail) return null;

  return (
    <>
      <ListButton
        title="목록 보기"
        onClick={() => router.push("/equipments")}
        style={{
          marginBottom: "20px",
        }}
      />
      <FormWrapper width="100%" maxWidth="100%">
        <div className={styles.flexibleInline}>
          <div className={styles.detailWrapper}>
            <div className={styles.sectionWrapper}>
              <Label title="카테고리" />
              <EditableField isEditable={false} value={selectedCategory} />
            </div>
            <Margin top={20} />

            <div className={styles.sectionWrapper}>
              <Label title="장비명" />
              <EditableField
                isEditable={false}
                fullWidth
                value={equipmentDetail.title}
              />
            </div>
            <Margin top={20} />

            <div className={styles.sectionWrapper}>
              <Label title="수량" />
              <EditableField
                isEditable={false}
                fullWidth
                value={`${equipmentDetail.quantity} 개`}
              />
            </div>
            <Margin top={40} />

            <div className={styles.sectionWrapper}>
              <Label title="렌탈 가격" />
              <Margin top={20} right={20}>
                <PriceListTable priceList={priceList} />
              </Margin>
            </div>
            <Margin top={40} />

            <div className={styles.sectionWrapper}>
              <Label title="상세 정보" />
              <EditableField
                isEditable={false}
                fullWidth
                multiline
                value={equipmentDetail.detail}
              />
            </div>

            <Margin top={40} />
            <div className={styles.sectionWrapper}>
              <Label title="메모" />
              <EditableField
                isEditable={false}
                fullWidth
                multiline
                value={equipmentDetail?.memo || ""}
              />
            </div>
          </div>
          <div className={styles.reservationCalendarWrapper}>
            <Label title="예약 현황" />
            <MonthCalendar
              size={500}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              eventDateList={eventDateList}
              onClickEvent={(event) => {
                window.open(`/reservations/${event.id}`, "_blank");
              }}
            />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="Small"
            style={{ width: "100px" }}
            variant="outlined"
            onClick={handleDeleteEquipment}
          >
            삭제
          </Button>
          <Margin right={12} />
          <Button
            size="Small"
            style={{ width: "100px" }}
            onClick={() => router.push(`/equipments/${equipmentId}/edit`)}
          >
            수정
          </Button>
        </div>
      </FormWrapper>
    </>
  );
};

export default EquipmentDetailPage;
