"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "./setEditPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { EquipmentSearchModal } from "@/app/equipments/modules/EquipmentSearchModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isEmpty, isNil } from "lodash";
import { useSetEquipmentForm } from "../../create/hooks/useSetEquipmentForm";
import { useSetEquipmentDetail } from "../hooks/useSetEquipmentDetail";
import { useParams } from "next/navigation";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { GridTable } from "@/app/components/Table/GridTable";
import { QuantityChangingModal } from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { Margin } from "@/app/components/Margin";
import {
  PriceItemStateType,
  PriceListTable,
  PriceSettingModal,
} from "@/app/equipments/modules/PriceSettingModal/PriceSettingModal";
import { EquipmentGroupPriceItem } from "@/app/types/equipmentPriceType";
import { useGroupEquipmentPriceList } from "@/app/equipments/[id]/hooks/useGroupEquipmentPriceList";
import { updateGroupPriceList } from "@/app/equipments/actions/updateGroupPriceList";
import { showToast } from "@/app/utils/toastUtils";
import { getGroupEquipmentListColumns } from "../../modules/getGroupEquipmentListColumns";
import { EQUIPMENT_AVAILABILITY_MENU_LIST } from "@/app/equipments/utils/equipmentUtils";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";

const EquipmentEditPage = () => {
  const { id } = useParams();
  const setId = Number(id);
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const originalEquipmentList = useRef<EquipmentListItemType[]>([]);
  const [isOpenPriceSettingModal, setIsOpenPriceSettingModal] = useState(false);
  const [isOpenQuantityChangeModal, setIsOpenQuantityChangeModal] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState<
    EquipmentListItemType | undefined
  >(undefined);
  const [priceList, setPriceList] = useState<EquipmentGroupPriceItem[]>([]);
  const originalPriceList = useRef<EquipmentGroupPriceItem[]>([]);

  const {
    title,
    setTitle,
    setPrice,
    detail,
    setDetail,
    memo,
    setMemo,
    onEditSetEquipment,
    equipmentList,
    setEquipmentList,
    disabled,
    setDisabled,
  } = useSetEquipmentForm();

  const { detail: setEquipmentDetail, isLoading } = useSetEquipmentDetail(
    Number(id)
  );
  const { fetchGroupPriceList } = useGroupEquipmentPriceList();

  const handleFetchPriceList = useCallback((id: number) => {
    fetchGroupPriceList(id)
      .then((response) => {
        setPriceList(response);
        originalPriceList.current = response;
      })
      .catch(() => setPriceList([]));
  }, []);

  const handleUpdatePriceList = useCallback(
    async (list: PriceItemStateType[]) => {
      try {
        await updateGroupPriceList(setId, list, originalPriceList.current);
        setIsOpenPriceSettingModal(false);
        showToast({
          message: "가격이 수정되었습니다.",
          type: "success",
        });
        handleFetchPriceList(setId);
      } catch {
        showToast({ message: "가격을 수정할 수 없습니다.", type: "error" });
      }
    },
    [setId, handleFetchPriceList]
  );

  useEffect(() => {
    if (!setEquipmentDetail) return;

    setPrice(setEquipmentDetail.price);
    setTitle(setEquipmentDetail.title);
    setDetail(setEquipmentDetail.detail);
    setMemo(setEquipmentDetail?.memo || "");
    setEquipmentList(setEquipmentDetail.equipmentList);
    originalEquipmentList.current = setEquipmentDetail.equipmentList;
  }, [setEquipmentDetail]);

  useEffect(() => {
    if (!setId || isNaN(setId)) return;

    handleFetchPriceList(setId);
  }, [setId, handleFetchPriceList]);

  const columns = useMemo(
    () =>
      getGroupEquipmentListColumns({
        onDeleteItem: (id) =>
          setEquipmentList(equipmentList.filter((item) => item.id !== id)),
        onSelectQuantityChange: (row: EquipmentListItemType) => {
          setSelectedRow(row);
          setIsOpenQuantityChangeModal(true);
        },
      }),
    [equipmentList]
  );

  return (
    <div>
      <FormWrapper title="풀세트 등록" isLoading={isLoading}>
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
          <Label title="세트명" />
          <EditableField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Margin top={20} />

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
        <Margin top={40} />

        <div className={formStyles.sectionWrapper}>
          <Label title="포함 장비" />
          <Button
            variant="outlined"
            size="Small"
            style={{
              width: "200px",
            }}
            onClick={() => setIsOpenSearchModal(true)}
          >
            장비 추가하기
          </Button>

          {!isEmpty(equipmentList) && (
            <GridTable<EquipmentListItemType>
              hideFooter
              rows={equipmentList}
              columns={columns}
              getRowId={(row) => row.id}
            />
          )}
        </div>
        <Margin top={40} />

        <div className={formStyles.sectionWrapper}>
          <Label title="메모" />
          <TextField
            fullWidth
            multiline
            value={memo}
            placeholder="메모를 입력해주세요."
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "150px" }}
            onClick={() =>
              onEditSetEquipment(Number(id), originalEquipmentList.current)
            }
          >
            수정
          </Button>
        </div>
      </FormWrapper>

      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(list) => setEquipmentList((prev) => [...prev, ...list])}
          disabledIdList={equipmentList.map((item) => item.id)}
        />
      )}
      {isOpenPriceSettingModal && (
        <PriceSettingModal
          priceList={priceList}
          onClose={() => setIsOpenPriceSettingModal(false)}
          onConfirm={handleUpdatePriceList}
          mode={"group"}
          id={Number(id)}
        />
      )}

      {isOpenQuantityChangeModal && !isNil(selectedRow) && (
        <QuantityChangingModal
          currentQuantity={selectedRow.quantity}
          onConfirm={(quantity) => {
            setEquipmentList((prev) =>
              prev.map((item) =>
                item.id === selectedRow.id ? { ...item, quantity } : item
              )
            );
          }}
          onClose={() => {
            setSelectedRow(undefined);
            setIsOpenQuantityChangeModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EquipmentEditPage;
