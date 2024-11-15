"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuoteDetail } from "../hooks/useQuoteDetail";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import formStyles from "@components/Form/index.module.scss";
import { Label } from "@/app/components/Form/Label";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import styles from "../quotePage.module.scss";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { Button } from "@/app/components/Button";
import { QuotationItem } from "../modules/QuotationItem";
import { ListButton } from "@/app/components/Button/ListButton";
import { formatDateTime } from "@/app/utils/timeUtils";

const defaultString = "-";

const QuoteDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const quoteId = Number(id);

  const { detail, quoteItemList, rentalDays } = useQuoteDetail(quoteId);

  if (!detail) return;

  return (
    <>
      <ListButton
        title="목록 보기"
        onClick={() => router.push("/quotes")}
        style={{
          marginBottom: "20px",
        }}
      />
      <FormWrapper title={detail.title}>
        <div className={formStyles.sectionWrapper}>
          <Label title="고객 정보" />

          <Label title="이름" />
          <EditableField
            isEditable={false}
            value={detail.userName || defaultString}
          />
          <Margin top={10} />
          <Label title="전화번호" />
          <EditableField
            isEditable={false}
            value={detail.guestPhoneNumber || defaultString}
          />
        </div>
        <div className={formStyles.sectionWrapper}>
          <Label title={`대여 기간 (총 ${rentalDays}일)`} />
          <div className={styles.inlineWrapper}>
            <EditableField
              isEditable={false}
              value={formatDateTime(detail.startDate)}
            />
            <div className={styles.separator}>~</div>
            <EditableField
              isEditable={false}
              value={formatDateTime(detail.endDate)}
            />
          </div>
          <Margin top={20} />

          {rentalDays > 0 && (
            <div className={formStyles.sectionWrapper}>
              <Label title="대여 장비 목록" />

              <div className={styles.equipmentListWrapper}>
                {quoteItemList.map((quote) => {
                  return (
                    <QuotationItem
                      key={quote.id}
                      quoteItem={quote}
                      rentalDays={rentalDays}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {quoteItemList.length > 0 && (
            <div className={styles.priceSection}>
              <div className={styles.discountPriceWrapper}>
                <Label title="정가" />
                <div>{formatLocaleString(detail.supplyPrice)}원</div>
              </div>

              {!!detail.discountPrice && detail.discountPrice > 0 && (
                <div className={styles.discountPriceWrapper}>
                  <Label title="할인 금액" />
                  <EditableField
                    isEditable={false}
                    value={`-${formatLocaleString(detail.discountPrice)}원`}
                  />
                </div>
              )}
              <div className={styles.totalPriceWrapper}>
                <div className={styles.totalPrice}>
                  총 {formatLocaleString(detail.totalPrice)}원 (
                </div>
                <div> {formatKoreanCurrency(detail.totalPrice)})</div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "150px" }}
            //   onClick={onCreateQuote}
          >
            수정하기
          </Button>
          <Margin left={16} />
          <Button
            size="Medium"
            variant="outlined"
            style={{ width: "150px" }}
            //   onClick={onCreateQuote}
          >
            예약 생성
          </Button>
        </div>
      </FormWrapper>
    </>
  );
};

export default QuoteDetailPage;
