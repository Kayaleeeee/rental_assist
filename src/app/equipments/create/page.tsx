"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { MenuItem, Select, TextField } from "@mui/material";
import { useCreateForm } from "../form/useCreateForm";
import { Label } from "@/app/components/Form/Label";
import styles from "./page.module.scss";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";

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
  } = useCreateForm();

  return (
    <FormWrapper title="장비 등록">
      <div className={styles.sectionWrapper}>
        <Label title="카테고리" />
        <Select<string>
          title="카테고리"
          value={category.key}
          fullWidth
          onChange={(e) => {
            onChangeCategory(e.target.value);
          }}
          children={categoryMenu.map((item) => (
            <MenuItem
              key={item.key}
              selected={item.key === category.key}
              value={item.key}
            >
              {item.title}
            </MenuItem>
          ))}
        />
      </div>

      <div className={styles.sectionWrapper}>
        <Label title="장비명" />
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

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
        <div className={styles.convertedPrice}>
          {formatKoreanCurrency(price)}
        </div>
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
