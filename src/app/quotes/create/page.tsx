"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../quotePage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { EditableField } from "@/app/components/EditableField";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";
import { useQuoteForm } from "../hooks/useQuoteForm";
import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { useState } from "react";

const QuoteCreatePage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const { form, onChangeForm } = useQuoteForm();

  return (
    <FormWrapper title="견적서 생성">
      <div className={formStyles.sectionWrapper}>
        <Label title="기간 설정" />
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

          <div onClick={() => setIsOpenSearchModal(true)}>장비 추가</div>
        </div>
      </div>
      {isOpenSearchModal && (
        <Modal
          onCloseModal={() => setIsOpenSearchModal(false)}
          ButtonProps={[
            {
              title: "닫기",
              onClick: () => setIsOpenSearchModal(false),
            },
            {
              title: "추가하기",
              onClick: () => {},
            },
          ]}
        >
          <div></div>
        </Modal>
      )}

      {/* <div className={formStyles.sectionWrapper}>
        <Label title="장비명" />
        <EditableField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div> */}

      <div className={styles.buttonWrapper}>
        <Button size="Medium" style={{ width: "150px" }}>
          생성하기
        </Button>
      </div>
    </FormWrapper>
  );
};

export default QuoteCreatePage;
