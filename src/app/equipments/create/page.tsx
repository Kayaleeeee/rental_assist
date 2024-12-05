"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { MenuItem, Select, TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { useEquipmentForm } from "./hooks/useEquipmentForm";
import { Margin } from "@/app/components/Margin";
import {
  PriceItemStateType,
  PriceListTable,
  PriceSettingModal,
} from "../modules/PriceSettingModal/PriceSettingModal";
import { useCallback, useState } from "react";
import { showToast } from "@/app/utils/toastUtils";
import { EquipmentPostBody } from "@/app/types/equipmentType";
import { createEquipment } from "../actions/createEquipment";
import { useRouter } from "next/navigation";

const EquipmentCreatePage = () => {
  const router = useRouter();
  const [priceList, setPriceList] = useState<PriceItemStateType[]>([]);
  const [isOpenPriceSettingModal, setIsOpenPriceSettingModal] = useState(false);

  const {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    detail,
    setDetail,
    memo,
    setMemo,
    quantity,
    setQuantity,
  } = useEquipmentForm();

  const handleUpdatePriceList = useCallback(
    async (list: PriceItemStateType[]) => {
      setPriceList(list);
      setIsOpenPriceSettingModal(false);
    },
    []
  );

  const handleCreateEquipment = useCallback(async () => {
    try {
      const payload: EquipmentPostBody = {
        title,
        quantity,
        memo,
        detail,
        category: category.key,
        price: priceList[0].price,
      };

      await createEquipment({ form: payload, priceList });
      showToast({ message: "장비가 등록되었습니다.", type: "success" });

      router.push("/equipments");
    } catch {
      showToast({ message: "장비등록에 실패했습니다", type: "error" });
    }
  }, [category, title, quantity, memo, detail, router]);

  return (
    <>
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
        <Margin top={20} />

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

        <Margin top={40} />
        <div className={styles.sectionWrapper}>
          <div
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Label title="렌탈 가격" />
            <Button
              variant="outlined"
              size="Small"
              onClick={() => setIsOpenPriceSettingModal(true)}
            >
              가격 등록하기
            </Button>
          </div>

          <Margin top={20} />
          <PriceListTable priceList={priceList} />
        </div>

        <Margin top={40} />
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
            onClick={handleCreateEquipment}
          >
            등록
          </Button>
        </div>
      </FormWrapper>
      {isOpenPriceSettingModal && (
        <PriceSettingModal
          priceList={priceList}
          onClose={() => setIsOpenPriceSettingModal(false)}
          onConfirm={handleUpdatePriceList}
          mode={"item"}
        />
      )}
    </>
  );
};

export default EquipmentCreatePage;
