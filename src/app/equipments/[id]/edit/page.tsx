"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { MenuItem, Select, TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { useEquipmentForm } from "../../create/hooks/useEquipmentForm";
import styles from "../../page.module.scss";
import { useParams, useRouter } from "next/navigation";
import { useEquipmentDetail } from "../hooks/useEquipmentDetail";
import { useCallback, useEffect, useRef, useState } from "react";
import { Margin } from "@/app/components/Margin";
import {
  PriceItemStateType,
  PriceListTable,
  PriceSettingModal,
} from "../../modules/PriceSettingModal/PriceSettingModal";
import { useEquipmentPriceList } from "../hooks/useEquipmentPriceList";
import { EquipmentPriceItem } from "@/app/types/equipmentPriceType";
import { updatePriceList } from "../../actions/updatePriceList";
import { showToast } from "@/app/utils/toastUtils";
import { ListButton } from "@/app/components/Button/ListButton";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { EQUIPMENT_AVAILABILITY_MENU_LIST } from "../../utils/equipmentUtils";

const EditEquipmentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [priceList, setPriceList] = useState<EquipmentPriceItem[]>([]);

  const originalPriceList = useRef<EquipmentPriceItem[]>([]);
  const [isOpenPriceSettingModal, setIsOpenPriceSettingModal] = useState(false);
  const equipmentId = Number(id);

  const {
    categoryMenu,
    category,
    onChangeCategory,
    title,
    setTitle,
    editEquipmentForm,
    detail,
    setDetail,
    memo,
    setMemo,
    quantity,
    setQuantity,
    disabled,
    setDisabled,
  } = useEquipmentForm();
  const { fetchPriceList } = useEquipmentPriceList();

  const { detail: equipmentDetail, isLoading } =
    useEquipmentDetail(equipmentId);

  const handleFetchPriceList = useCallback((id: number) => {
    fetchPriceList(id)
      .then((response) => {
        setPriceList(response);
        originalPriceList.current = response;
      })
      .catch(() => setPriceList([]));
  }, []);

  useEffect(() => {
    if (!equipmentDetail) return;

    setTitle(equipmentDetail.title);
    setDetail(equipmentDetail.detail);
    setQuantity(equipmentDetail.quantity);
    setDisabled(equipmentDetail.disabled || false);
    onChangeCategory(equipmentDetail.category);
  }, [equipmentDetail]);

  useEffect(() => {
    if (!equipmentId || isNaN(equipmentId)) return;

    handleFetchPriceList(equipmentId);
  }, [equipmentId, handleFetchPriceList]);

  const handleUpdatePriceList = useCallback(
    async (list: PriceItemStateType[]) => {
      try {
        await updatePriceList(equipmentId, list, originalPriceList.current);
        setIsOpenPriceSettingModal(false);
        showToast({
          message: "가격이 수정되었습니다.",
          type: "success",
        });
        handleFetchPriceList(equipmentId);
      } catch {
        showToast({ message: "가격을 수정할 수 없습니다.", type: "error" });
      }
    },
    [equipmentId, handleFetchPriceList]
  );

  return (
    <>
      <ListButton
        title="목록 보기"
        onClick={() => router.push(`/equipments/${equipmentId}`)}
      />
      <Margin top={20} />
      <FormWrapper title="장비 수정" isLoading={isLoading}>
        <div className={formStyles.sectionWrapper}>
          <Label title="장비 사용가능 여부" />
          <div className={styles.availabilityMenuWrapper}>
            {EQUIPMENT_AVAILABILITY_MENU_LIST.map((item) => {
              return (
                <div
                  className={styles.availabilityMenu}
                  key={item.key}
                  onClick={() => setDisabled(item.key === "unavailable")}
                >
                  <CustomCheckbox
                    checked={
                      (disabled && item.key === "unavailable") ||
                      (!disabled && item.key === "available")
                    }
                  />
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
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
              가격 수정하기
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
      {isOpenPriceSettingModal && (
        <PriceSettingModal
          priceList={priceList}
          onClose={() => setIsOpenPriceSettingModal(false)}
          onConfirm={handleUpdatePriceList}
          mode={"item"}
          id={equipmentId}
        />
      )}
    </>
  );
};

export default EditEquipmentPage;
