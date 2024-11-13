"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../quotePage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";
import { useQuoteForm } from "../hooks/useQuoteForm";
import { Margin } from "@/app/components/Margin";
import { useMemo, useState } from "react";
import { EquipmentSearchModal } from "../modules/EquipmentSearchModal";
import { QuotationItemEditor } from "../modules/QuotationItemEditor";

import { getDiffDays } from "@/app/utils/timeUtils";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";

const QuoteCreatePage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const { form, onChangeForm } = useQuoteForm();

  const rentalDays = useMemo(() => {
    if (!form.endDateTime || !form.startDateTime) return 0;

    return getDiffDays(form.startDateTime, form.endDateTime);
  }, [form.startDateTime, form.endDateTime]);

  const totalPrice = useMemo(() => {
    return form.equipmentList.reduce((prev, acc) => {
      return (prev += acc.price * rentalDays);
    }, 0);
  }, [form.equipmentList, rentalDays]);

  const onClickOpenEquipemtModal = () => {
    if (rentalDays === 0) {
      alert("기간을 먼저 설정해주세요.");
      return;
    }

    setIsOpenSearchModal(true);
  };

  return (
    <FormWrapper title="견적서 생성">
      <div className={formStyles.sectionWrapper}>
        <Label title={`기간 설정 (총 ${rentalDays}일)`} />
        <Margin top={10} />
        <div className={styles.inlineWrapper}>
          <DateTimeSelector
            label="대여 시작 시간"
            value={form.startDateTime}
            onChange={(value) => onChangeForm("startDateTime", value)}
          />
          <div className={styles.separator}>~</div>
          <DateTimeSelector
            label="반납 시간"
            value={form.endDateTime}
            onChange={(value) => onChangeForm("endDateTime", value)}
          />
        </div>
        <Margin top={20} />
        <div className={formStyles.sectionWrapper}>
          <Label title="대여 장비 목록" />

          <Margin top={10} bottom={20}>
            <Button
              size="Small"
              variant="outlined"
              onClick={onClickOpenEquipemtModal}
              style={{
                width: "200px",
              }}
            >
              장비 추가
            </Button>
          </Margin>

          <div className={styles.equipmentListWrapper}>
            {form.equipmentList.map((equipment) => {
              return (
                <QuotationItemEditor
                  key={equipment.id}
                  rentalDays={rentalDays}
                  equipmentState={equipment}
                  onChangeField={(state) =>
                    onChangeForm(
                      "equipmentList",
                      form.equipmentList.map((item) =>
                        item.id === equipment.id ? state : item
                      )
                    )
                  }
                  onDeleteEquipment={() => {
                    onChangeForm(
                      "equipmentList",
                      form.equipmentList.filter(
                        (item) => item.id !== equipment.id
                      )
                    );
                  }}
                />
              );
            })}
          </div>

          <div className={styles.totalPriceWrapper}>
            <div className={styles.totalPrice}>
              총 {formatLocaleString(totalPrice)}원 (
            </div>
            <div> {formatKoreanCurrency(totalPrice)})</div>
          </div>
        </div>
      </div>
      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(list) =>
            onChangeForm("equipmentList", form.equipmentList.concat(list))
          }
        />
      )}

      <div className={styles.buttonWrapper}>
        <Button size="Medium" style={{ width: "150px" }}>
          생성하기
        </Button>
      </div>
    </FormWrapper>
  );
};

export default QuoteCreatePage;
