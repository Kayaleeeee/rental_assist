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
import { EditableField } from "@/app/components/EditableField";

const QuoteCreatePage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const {
    form,
    onChangeForm,
    quoteItemListState,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    onAddQuoteItemList,
  } = useQuoteForm();

  const rentalDays = useMemo(() => {
    if (!form.endDate || !form.startDate) return 0;

    return getDiffDays(form.startDate, form.endDate);
  }, [form.startDate, form.endDate]);

  const totalPrice = useMemo(() => {
    if (!rentalDays) return 0;

    return quoteItemListState.reduce(
      (prev, acc) => (prev += acc.totalPrice * rentalDays),
      0
    );
  }, [quoteItemListState, rentalDays]);

  const onClickEquipmentModal = () => {
    if (rentalDays === 0) {
      alert("기간을 먼저 설정해주세요.");
      return;
    }

    setIsOpenSearchModal(true);
  };

  return (
    <FormWrapper title="견적서 생성">
      <div className={formStyles.sectionWrapper}>
        <Label title="고객 정보" />

        <Label title="이름" />
        <EditableField
          value={form.guestName}
          onChange={(e) => onChangeForm("guestName", e.target.value)}
        />
        <Margin top={10} />
        <Label title="전화번호" />
        <EditableField
          value={form.guestPhoneNumber || ""}
          onChange={(e) => {
            onChangeForm("guestPhoneNumber", e.target.value);
          }}
        />
      </div>
      <div className={formStyles.sectionWrapper}>
        <Label title={`기간 설정 (총 ${rentalDays}일)`} />
        <Margin top={10} />
        <div className={styles.inlineWrapper}>
          <DateTimeSelector
            label="대여 시작 시간"
            value={form.startDate}
            onChange={(value) => onChangeForm("startDate", value)}
          />
          <div className={styles.separator}>~</div>
          <DateTimeSelector
            label="반납 시간"
            value={form.endDate}
            onChange={(value) => onChangeForm("endDate", value)}
          />
        </div>
        <Margin top={20} />
        <div className={formStyles.sectionWrapper}>
          <Label title="대여 장비 목록" />

          <Margin top={10} bottom={20}>
            <Button
              size="Small"
              variant="outlined"
              onClick={onClickEquipmentModal}
              style={{
                width: "200px",
              }}
            >
              장비 추가
            </Button>
          </Margin>

          <div className={styles.equipmentListWrapper}>
            {quoteItemListState.map((quote) => {
              return (
                <QuotationItemEditor
                  key={quote.equipmentId}
                  rentalDays={rentalDays}
                  quoteState={quote}
                  onChangeField={(state) =>
                    onChangeQuoteItem(quote.equipmentId, state)
                  }
                  onDeleteEquipment={() => onDeleteQuoteItem(quote.equipmentId)}
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
          onConfirm={onAddQuoteItemList}
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
