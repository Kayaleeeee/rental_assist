"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../../page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { useSetEquipmentForm } from "./hooks/useSetEquipmentForm";
import { EquipmentSearchModal } from "@/app/equipments/modules/EquipmentSearchModal";
import { useCallback, useMemo, useState } from "react";
import { isEmpty, isNil } from "lodash";
import { Margin } from "@/app/components/Margin";
import {
  PriceItemStateType,
  PriceListTable,
  PriceSettingModal,
} from "../../modules/PriceSettingModal/PriceSettingModal";
import {
  EquipmentListItemType,
  SetEquipmentPayload,
} from "@/app/types/equipmentType";
import { createGroupEquipment } from "../actions/createGroupEquipment";
import { showToast } from "@/app/utils/toastUtils";
import { useRouter } from "next/navigation";

import { GridTable } from "@/app/components/Table/GridTable";
import { QuantityChangingModal } from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { getGroupEquipmentListColumns } from "../modules/getGroupEquipmentListColumns";

const EquipmentCreatePage = () => {
  const router = useRouter();
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [isOpenPriceSettingModal, setIsOpenPriceSettingModal] = useState(false);
  const [priceList, setPriceList] = useState<PriceItemStateType[]>([]);
  const [isOpenQuantityChangeModal, setIsOpenQuantityChangeModal] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState<
    EquipmentListItemType | undefined
  >(undefined);

  const {
    title,
    setTitle,
    detail,
    setDetail,
    memo,
    setMemo,
    equipmentList,
    setEquipmentList,
  } = useSetEquipmentForm();

  const handleUpdatePriceList = useCallback(
    async (list: PriceItemStateType[]) => {
      setPriceList(list);
      setIsOpenPriceSettingModal(false);
    },
    []
  );

  const handleCreateEquipment = useCallback(async () => {
    try {
      const payload: SetEquipmentPayload = {
        title,
        memo,
        detail,
      };

      await createGroupEquipment({ form: payload, equipmentList, priceList });
      showToast({ message: "장비가 등록되었습니다.", type: "success" });

      router.push("/equipments");
    } catch {
      showToast({ message: "장비등록에 실패했습니다", type: "error" });
    }
  }, [title, memo, detail, router, equipmentList]);

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
      <FormWrapper title="풀세트 등록">
        <div className={formStyles.sectionWrapper}>
          <Label title="세트명" />
          <EditableField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              {isEmpty(priceList) ? "가격 등록하기" : "가격 수정하기"}
            </Button>
          </div>

          <Margin top={20} />
          <PriceListTable priceList={priceList} />
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
            onClick={handleCreateEquipment}
          >
            등록
          </Button>
        </div>
      </FormWrapper>

      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(equipmentList) =>
            setEquipmentList((prev) => [...prev, ...equipmentList])
          }
          disabledIdList={equipmentList.map((item) => item.id)}
        />
      )}
      {isOpenPriceSettingModal && (
        <PriceSettingModal
          priceList={priceList}
          onClose={() => setIsOpenPriceSettingModal(false)}
          onConfirm={handleUpdatePriceList}
          mode={"group"}
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

export default EquipmentCreatePage;
