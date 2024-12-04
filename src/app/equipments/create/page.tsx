"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { MenuItem, Select, TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { useEquipmentForm } from "./hooks/useEquipmentForm";
import { Margin } from "@/app/components/Margin";

const EquipmentCreatePage = () => {
  const {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    price,
    setPrice,
    submitEquipmentForm,
    detail,
    setDetail,
    memo,
    setMemo,
    quantity,
    setQuantity,
  } = useEquipmentForm();

  return (
    <FormWrapper title="장비 등록">
      <div className={formStyles.sectionWrapper}>
        <Label title="카테고리" />
        <Select<string>
          title="카테고리"
          value={category.key}
          fullWidth
          onChange={(e) => {
            onChangeCategory(e.target.value);
          }}
        >
          {categoryMenu.map((item) => (
            <MenuItem
              key={item.key}
              selected={item.key === category.key}
              value={item.key}
            >
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={styles.sectionWrapper}>
        <Label title="장비명" />
        <EditableField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <Margin top={20} />
      <div className={styles.sectionWrapper}>
        <Label title="수량" />
        <EditableField
          fullWidth
          value={quantity}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            setQuantity(value);
          }}
        />
      </div>
      <Margin top={20} />
      <div className={styles.sectionWrapper}>
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

      <Margin top={20} />
      <div className={styles.sectionWrapper}>
        <Label title="상세 정보" />
        <TextField
          fullWidth
          multiline
          value={detail}
          placeholder="상세 정보를 입력해주세요."
          onChange={(e) => setDetail(e.target.value)}
        />
      </div>

      <Margin top={40} />
      <div className={styles.sectionWrapper}>
        <Label title="메모" />
        <EditableField
          fullWidth
          multiline
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
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
