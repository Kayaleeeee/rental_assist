import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";
import { getEquipmentTotalPrice } from "../../utils/reservationUtils";
import { isEmpty, isNil } from "lodash";
import {
  PriceChangingModal,
  QuantityChangingModal,
  QUOTE_ITEM_MENU,
  QuoteEquipmentMoreMenu,
} from "./QuoteEquipmentMenu";
import { useMemo, useState } from "react";

type Props = {
  rows: EquipmentListItemState[];
  rentalDays: number;
  onDeleteEquipment: (
    equipmentId: EquipmentListItemState["equipmentId"]
  ) => void;
  onChangeField: (item: EquipmentListItemState) => void;
};
export const ReservationItemTableEditor = ({
  rows,
  rentalDays,
  onDeleteEquipment,
  onChangeField,
}: Props) => {
  const [modalProps, setModalProps] = useState<
    | {
        mode: "price" | "quantity";
        selectedRow: EquipmentListItemState;
      }
    | undefined
  >(undefined);

  const columns = useMemo((): GridColDef<EquipmentListItemState>[] => {
    return [
      {
        field: "id",
        width: 80,
        renderHeader: () => HeaderName("ID"),
        renderCell: ({ row }) => row.equipmentId,
      },
      {
        field: "title",
        renderHeader: () => HeaderName("장비명"),
        renderCell: ({ row }) => row.title,
        flex: 1,
      },
      {
        field: "quantity",
        renderHeader: () => HeaderName("수량"),
        renderCell: ({ row }) => <>{row.quantity}개</>,
      },
      {
        field: "price",
        renderHeader: () => HeaderName("단가"),
        renderCell: ({ row }) => formatLocaleString(row.price),
      },
      {
        field: "rentalDays",
        renderHeader: () => HeaderName("대여기간"),
        renderCell: () => <>{rentalDays}일</>,
      },

      {
        field: "discountPrice",
        renderHeader: () => HeaderName("조정 금액"),
        renderCell: ({ row }) =>
          isNil(row.discountPrice) || row.discountPrice === 0
            ? "없음"
            : `${row.discountPrice > 0 ? "-" : "+"}${formatLocaleString(
                row.discountPrice
              )}원`,
      },
      {
        field: "totalPrice",
        renderHeader: () => HeaderName("총 금액"),
        renderCell: ({ row }) =>
          HeaderName(
            `${formatLocaleString(getEquipmentTotalPrice(row, rentalDays))}원`
          ),
      },
      {
        field: "edit",
        renderHeader: () => HeaderName(""),
        width: 50,
        align: "center",
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
              menu={QUOTE_ITEM_MENU}
              onConfirm={(menu) => {
                if (!menu) return;

                if (menu.key === "delete") {
                  onDeleteEquipment(row.equipmentId);
                  return;
                }

                setModalProps({
                  mode: menu.key as "price" | "quantity",
                  selectedRow: row,
                });
              }}
            />
          </div>
        ),
      },
    ];
  }, [rentalDays]);

  return (
    <>
      <GridTable<EquipmentListItemState>
        hideFooter
        getRowId={(row) => row.equipmentId}
        rows={rows}
        columns={columns}
        height={isEmpty(rows) ? "150px" : undefined}
        emptyHeight="100px"
      />
      {!isNil(modalProps) && modalProps.mode === "price" && (
        <PriceChangingModal
          currentTotalPrice={
            modalProps.selectedRow.price *
            rentalDays *
            modalProps.selectedRow.quantity
          }
          currentDiscountPrice={modalProps.selectedRow.discountPrice || 0}
          onConfirm={(price) =>
            onChangeField({ ...modalProps.selectedRow, discountPrice: price })
          }
          onClose={() => setModalProps(undefined)}
        />
      )}

      {!isNil(modalProps) && modalProps.mode === "quantity" && (
        <QuantityChangingModal
          currentQuantity={modalProps.selectedRow.quantity}
          onConfirm={(quantity) =>
            onChangeField({
              ...modalProps.selectedRow,
              quantity,
            })
          }
          onClose={() => setModalProps(undefined)}
        />
      )}
    </>
  );
};
