"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../../page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { useSetEquipmentForm } from "./hooks/useSetEquipmentForm";

const EquipmentCreatePage = () => {
  const {
    title,
    setTitle,
    price,
    setPrice,
    submitEquipmentForm,
    detail,
    setDetail,
  } = useSetEquipmentForm();

  return (
    <FormWrapper title="풀세트 등록">
      <div className={formStyles.sectionWrapper}>
        <Label title="세트명" />
        <EditableField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={formStyles.sectionWrapper}>
        <Label title="렌탈 가격" />
        <TextField
          fullWidth
          value={price}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            if (value < 0) return;

            setPrice(value);
          }}
        />
        <div style={{ marginTop: "10px" }} />
        <div className={styles.convertedPrice}>
          {formatKoreanCurrency(price)}
        </div>
      </div>

      <div className={formStyles.sectionWrapper}>
        <Label title="상세 정보" />
        <TextField
          fullWidth
          multiline
          value={detail}
          placeholder="상세 정보를 입력해주세요."
          onChange={(e) => setDetail(e.target.value)}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          size="Medium"
          style={{ width: "150px" }}
          onClick={submitEquipmentForm}
        >
          등록
        </Button>
      </div>
    </FormWrapper>
  );
};

export default EquipmentCreatePage;
