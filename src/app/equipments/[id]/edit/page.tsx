"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { MenuItem, Select, TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { formatKoreanCurrency } from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { useEquipmentForm } from "../../create/hooks/useEquipmentForm";
import styles from "../../page.module.scss";
import { useParams } from "next/navigation";
import { useEquipmentDetail } from "../hooks/useEquipmentDetail";
import { useEffect } from "react";
import { Margin } from "@/app/components/Margin";

const EditEquipmentPage = () => {
  const { id } = useParams();

  const equipmentId = Number(id);

  const {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    price,
    setPrice,
    editEquipmentForm,
    detail,
    setDetail,
    memo,
    setMemo,
    quantity,
    setQuantity,
  } = useEquipmentForm();

  const { detail: equipmentDetail } = useEquipmentDetail(equipmentId);

  useEffect(() => {
    if (!equipmentDetail) return;

    setTitle(equipmentDetail.title);
    setPrice(equipmentDetail.price);
    setDetail(equipmentDetail.detail);
    onChangeCategory(equipmentDetail.category);
  }, [equipmentDetail]);

  return (
    <FormWrapper title="장비 수정">
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

      <Margin top={30} />

      <div className={styles.sectionWrapper}>
        <Label title="메모" />
        <EditableField
          isEditable
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
          onClick={() => {
            if (!equipmentId) return;

            editEquipmentForm(equipmentId);
          }}
        >
          수정
        </Button>
      </div>
    </FormWrapper>
  );
};

export default EditEquipmentPage;
