"use client";

import { deleteSetEquipment } from "@/app/api/equipments/setEquipments";
import { Button } from "@/app/components/Button";
import { ListButton } from "@/app/components/Button/ListButton";
import { EditableField } from "@/app/components/EditableField";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { Label } from "@/app/components/Form/Label";
import { Margin } from "@/app/components/Margin";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { showToast } from "@/app/utils/toastUtils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./setDetailPage.module.scss";
import { useSetEquipmentDetail } from "./hooks/useSetEquipmentDetail";
import { isEmpty } from "lodash";
import { useEquipmentRentalDates } from "../../hooks/useEquipmentRentalDates";
import dayjs from "dayjs";
import { getPaddingDateRange } from "@/app/utils/timeUtils";
import { EquipmentItemWithRentedDates } from "@/app/types/equipmentType";
import {
  CalendarEventType,
  MonthCalendar,
} from "@/app/components/Calendar/MonthCalendar";
import { GroupEquipmentListTable } from "../modules/GroupEquipmentListTable";

const SetEquipmentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const equipmentId = Number(params.id);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { detail: setEquipmentDetail } = useSetEquipmentDetail(equipmentId);

  const [rentalInfo, setRentalInfo] = useState<EquipmentItemWithRentedDates[]>(
    []
  );
  const { fetchMultipleEquipmentRentalHistory } = useEquipmentRentalDates();

  const handleDeleteEquipment = useCallback(async () => {
    if (!setEquipmentDetail || !equipmentId) return;

    if (!confirm("장비를 삭제하시겠습니까?")) return;

    try {
      await deleteSetEquipment(equipmentId.toString());

      showToast({ message: "장비를 삭제했습니다", type: "success" });
      router.push(`/equipments`);
    } catch {
      showToast({ message: "장비를 삭제할 수 없습니다.", type: "error" });
    }
  }, [setEquipmentDetail, equipmentId, router]);

  const fetchEquipmentRentalDateList = useCallback(
    async (idList: number[]) => {
      const { startDate, endDate } = getPaddingDateRange(
        currentDate,
        15,
        "day"
      );

      const result = await fetchMultipleEquipmentRentalHistory({
        idList,
        startDate,
        endDate,
      });

      setRentalInfo(result);
    },

    [currentDate]
  );

  const eventDateList: CalendarEventType[] = useMemo(() => {
    const eventList: CalendarEventType[] = [];

    if (!rentalInfo) return [];

    rentalInfo.forEach((item) => {
      item.rentedDates.forEach((date) => {
        eventList.push({
          start: dayjs(date.startDate).toDate(),
          end: dayjs(date.endDate).toDate(),
          title: `${item.title} [${item.userName}]`,
          id: item.reservationId,
        });
      });
    });

    return eventList;
  }, [rentalInfo]);

  useEffect(() => {
    if (!setEquipmentDetail || isEmpty(setEquipmentDetail.equipmentList))
      return;

    const idList = setEquipmentDetail.equipmentList.map((item) => item.id);
    fetchEquipmentRentalDateList(idList);
  }, [setEquipmentDetail, fetchEquipmentRentalDateList]);

  if (!setEquipmentDetail) return null;

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
              <Label title="장비명" />
              <EditableField
                isEditable={false}
                fullWidth
                value={setEquipmentDetail.title}
              />
            </div>
            <Margin top={20} />

            <div className={styles.sectionWrapper}>
              <Label title="렌탈 가격" />
              <div className={styles.detailPriceWrapper}>
                <EditableField
                  isEditable={false}
                  fullWidth
                  value={formatLocaleString(setEquipmentDetail.price)}
                />
                <div
                  className={styles.convertedPrice}
                  style={{ marginLeft: "10px" }}
                >
                  ({formatKoreanCurrency(setEquipmentDetail.price)})
                </div>
              </div>
            </div>
            <Margin top={20} />

            <div className={styles.sectionWrapper}>
              <Label title="상세 정보" />
              <EditableField
                isEditable={false}
                fullWidth
                multiline
                value={setEquipmentDetail.detail}
              />
            </div>

            <Margin top={30} />
            <div className={styles.sectionWrapper}>
              <Label title="포함 장비 정보" />
              {!isEmpty(setEquipmentDetail.equipmentList) && (
                <Margin top={20}>
                  <GroupEquipmentListTable
                    checkboxSelection={false}
                    equipmentList={setEquipmentDetail.equipmentList}
                  />
                </Margin>
              )}
            </div>

            <Margin top={30} />
            <div className={styles.sectionWrapper}>
              <Label title="메모" />

              <EditableField
                isEditable={false}
                value={setEquipmentDetail.memo || ""}
              />
            </div>
            <Margin top={20} />
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
            onClick={() => {
              router.push(`/equipments/sets/${equipmentId}/edit`);
            }}
          >
            수정
          </Button>
        </div>
      </FormWrapper>
    </>
  );
};

export default SetEquipmentDetailPage;
