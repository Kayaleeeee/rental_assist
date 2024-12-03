import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";
import styles from "./reservationGroupTable.module.scss";
import { getEquipmentGroupTotalPrice } from "@/app/reservations/utils/reservationUtils";
import { isNil } from "lodash";
import {
  GROUP_QUOTE_ITEM_MENU,
  GROUP_QUOTE_MENU,
  PriceChangingModal,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { useMemo, useState } from "react";

type Props = {
  rentalDays: number;
  groupEquipment: SetEquipmentStateType;
  onClickAddEquipment: () => void;
  deleteSetEquipment: () => void;
  changeSetEquipment: (set: SetEquipmentStateType) => void;
};

export const ReservationGroupTableEditor = ({
  rentalDays,
  groupEquipment,
  onClickAddEquipment,
  deleteSetEquipment,
  changeSetEquipment,
}: Props) => {
  const [isOpenPriceChangingModal, setIsOpenPriceChangingModal] =
    useState(false);

  const columns = useMemo((): GridColDef<EquipmentListItemState>[] => {
    return [
      {
        field: "id",
        width: 80,
        renderHeader: () => HeaderName("ID"),
        renderCell: ({ row }) => row.equipmentId,
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
                  changeSetEquipment({
                    ...groupEquipment,
                    equipmentList: groupEquipment.equipmentList.filter(
                      (item) => item.equipmentId !== row.equipmentId
                    ),
                  });
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
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.groupInfo}>
          <div className={styles.title}>{groupEquipment.title}</div>
          <QuoteEquipmentMoreMenu
            menu={GROUP_QUOTE_MENU}
            onConfirm={(menu) => {
              if (!menu) return;

              if (menu.key === "delete") {
                deleteSetEquipment();
              }

              if (menu.key === "item") {
                onClickAddEquipment();
              }

              if (menu.key === "price") {
                setIsOpenPriceChangingModal(true);
              }
            }}
          />
        </div>
        <GridTable<EquipmentListItemState>
          hideFooter
          rows={groupEquipment.equipmentList}
          columns={columns}
          getRowId={(row) => row.equipmentId}
          sx={{
            border: "none",
            marginTop: 0,
            borderRadius: "none",
          }}
        />

        <div className={styles.footer}>
          <div className={styles.supplyPrice}>
            {`단가: ${formatLocaleString(
              groupEquipment.price
            )} 원  * ${rentalDays}일`}
          </div>
          {!isNil(groupEquipment.discountPrice) &&
            groupEquipment.discountPrice !== 0 && (
              <div className={styles.supplyPrice}>
                {`조정 금액: ${
                  groupEquipment.discountPrice > 0 ? "-" : "+"
                }${formatLocaleString(groupEquipment.discountPrice)} 원`}
              </div>
            )}
          <div className={styles.totalPrice}>
            {`총 ${formatLocaleString(
              getEquipmentGroupTotalPrice(groupEquipment, rentalDays)
            )} 원`}
          </div>
        </div>
      </div>
      {isOpenPriceChangingModal && (
        <PriceChangingModal
          currentTotalPrice={groupEquipment.price * rentalDays}
          currentDiscountPrice={groupEquipment.discountPrice || 0}
          onConfirm={(price) =>
            changeSetEquipment({ ...groupEquipment, discountPrice: price })
          }
          onClose={() => setIsOpenPriceChangingModal(false)}
        />
      )}
    </>
  );
};
