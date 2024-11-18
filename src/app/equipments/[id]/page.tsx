"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../page.module.scss";

import { EditableField } from "@/app/components/EditableField";
import { Label } from "@/app/components/Form/Label";
import { Button } from "@/app/components/Button";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { useEquipmentDetail } from "../hooks/useEquipmentDetail";
import { useParams, useRouter } from "next/navigation";
import { EquipmentCategoryList } from "@/app/types/equipmentType";
import { useMemo } from "react";
import { ListButton } from "@/app/components/Button/ListButton";
import { Margin } from "@/app/components/Margin";
import { CalendarComponent } from "@/app/components/Calendar";
import { useEquipmentRentalDates } from "../hooks/useEquipmenRentalDates";
import { convertRentedDaysToEvent } from "@/app/components/Calendar/calendarUtils";

const EquipmentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const equipmentId = Number(params.id);

  const { detail: equipmentDetail } = useEquipmentDetail(equipmentId);
  const { rentalDateList } = useEquipmentRentalDates(equipmentId);

  const eventDateList = useMemo(
    () => rentalDateList.map(convertRentedDaysToEvent),
    [rentalDateList]
  );

  const selectedCategory = useMemo(() => {
    if (!equipmentDetail) return "";

    return (
      EquipmentCategoryList.find(
        (item) => item.key === equipmentDetail.category
      )?.title || ""
    );
  }, [equipmentDetail]);

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
      <FormWrapper>
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
              <Label title="렌탈 가격" />
              <div className={styles.detailPriceWrapper}>
                <EditableField
                  isEditable={false}
                  fullWidth
                  value={formatLocaleString(equipmentDetail.price)}
                />
                <div
                  className={styles.convertedPrice}
                  style={{ marginLeft: "10px" }}
                >
                  ({formatKoreanCurrency(equipmentDetail.price)})
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
                value={equipmentDetail.detail}
              />
            </div>
            <Margin top={20} />
          </div>
          <div className={styles.reservationCalendarWrapper}>
            <Label title="예약 현황" />
            <CalendarComponent size={500} eventDateList={eventDateList} />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "150px" }}
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
