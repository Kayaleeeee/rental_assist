"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { TextField } from "@mui/material";
import { Label } from "@/app/components/Form/Label";
import styles from "../setDetailPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { EquipmentSearchModal } from "@/app/equipments/modules/EquipmentSearchModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { isEmpty } from "lodash";
import { useSetEquipmentForm } from "../../create/hooks/useSetEquipmentForm";
import { useSetEquipmentDetail } from "../hooks/useSetEquipmentDetail";
import { useParams } from "next/navigation";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { GridTable } from "@/app/components/Table/GridTable";
import {
  GROUP_QUOTE_ITEM_MENU,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { GridColDef } from "@mui/x-data-grid";
import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { Margin } from "@/app/components/Margin";
import {
  PriceListTable,
  PriceSettingModal,
} from "@/app/equipments/modules/PriceSettingModal/PriceSettingModal";

const EquipmentEditPage = () => {
  const { id } = useParams();
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const originalEquipmentList = useRef<EquipmentListItemType[]>([]);
  const [isOpenPriceSettingModal, setIsOpenPriceSettingModal] = useState(false);

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
  } = useSetEquipmentForm();

  const { detail: setEquipmentDetail, isLoading } = useSetEquipmentDetail(
    Number(id)
  );

  const columns = useMemo((): GridColDef<EquipmentListItemType>[] => {
    return [
      {
        field: "id",
        width: 80,
        renderHeader: () => HeaderName("ID"),
        renderCell: ({ row }) => row.id,
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: "title",
        renderHeader: () => HeaderName("장비명"),
        renderCell: ({ row }) => row.title,
        flex: 1,
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: "quantity",
        renderHeader: () => HeaderName("수량"),
        renderCell: ({ row }) => <>{row.quantity}개</>,
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
      },
      {
        field: "edit",
        renderHeader: () => HeaderName(""),
        renderCell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <QuoteEquipmentMoreMenu
              menu={GROUP_QUOTE_ITEM_MENU}
              onConfirm={(menu) => {
                if (!menu) return;

                if (menu.key === "delete") {
                  setEquipmentList(
                    equipmentList.filter((item) => item.id !== row.id)
                  );
                }
              }}
            />
          </div>
        ),
        width: 30,
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
      },
    ];
  }, [equipmentList]);

  useEffect(() => {
    if (!setEquipmentDetail) return;

    setPrice(setEquipmentDetail.price);
    setTitle(setEquipmentDetail.title);
    setDetail(setEquipmentDetail.detail);
    setMemo(setEquipmentDetail?.memo || "");
    setEquipmentList(setEquipmentDetail.equipmentList);
    originalEquipmentList.current = setEquipmentDetail.equipmentList;
  }, [setEquipmentDetail]);

  return (
    <div>
      <FormWrapper title="풀세트 등록" isLoading={isLoading}>
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
          <PriceListTable priceList={[]} />
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
          priceList={[]}
          onClose={() => setIsOpenPriceSettingModal(false)}
          onConfirm={() => {}}
          mode={"group"}
          id={Number(id)}
        />
      )}
    </div>
  );
};

export default EquipmentEditPage;
