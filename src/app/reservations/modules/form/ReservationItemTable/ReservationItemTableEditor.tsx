import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";

import { isEmpty, isNil } from "lodash";

import { useMemo } from "react";
import { EquipmentAvailableItem } from "@/app/types/reservationType";

import { useModal } from "@/app/components/Modal/useModal";
import { getEquipmentTotalPrice } from "@/app/reservations/utils/reservationUtils";
import {
  QUOTE_ITEM_MENU,
  QuoteEquipmentMoreMenu,
} from "../QuoteEquipmentMenu/QuoteEquipmentMenu";
import { UnavailableEquipmentList } from "../UnavailableEquipmentList";

type Props = {
  rows: EquipmentListItemState[];
  rounds: number;
  onDeleteEquipment: (
    equipmentId: EquipmentListItemState["equipmentId"]
  ) => void;
  onChangeField: (item: EquipmentListItemState) => void;
  availabilityCheckedList: EquipmentAvailableItem[];
};

export const ReservationItemTableEditor = ({
  rows,
  rounds,
  onDeleteEquipment,
  onChangeField,
  availabilityCheckedList,
}: Props) => {
  const { openModal } = useModal();

  const openQuantityChangeModal = (row: EquipmentListItemState) => {
    openModal({
      name: "equipmentQuantityChange",
      props: {
        currentQuantity: row.quantity,
        onConfirm: (quantity) => onChangeField({ ...row, quantity }),
      },
    });
  };

  const openPriceChangeModal = (row: EquipmentListItemState) => {
    openModal({
      name: "equipmentPriceChange",
      props: {
        currentDiscountPrice: row.discountPrice || 0,
        currentTotalPrice: row.price * row.quantity,
        onConfirm: (price) => onChangeField({ ...row, discountPrice: price }),
      },
    });
  };

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
        field: "rounds",
        renderHeader: () => HeaderName("대여기간"),
        renderCell: () => <>{rounds}일</>,
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
            `${formatLocaleString(
              getEquipmentTotalPrice({
                itemPrice: row.price,
                quantity: row.quantity,
                discountPrice: row.discountPrice,
              })
            )}원`
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

                if (menu.key === "price") {
                  openPriceChangeModal(row);
                }

                if (menu.key === "quantity") {
                  openQuantityChangeModal(row);
                }
              }}
            />
          </div>
        ),
      },
    ];
  }, [rounds]);

  const unavailableList = useMemo(() => {
    const list: EquipmentListItemState[] = [];

    rows.forEach((row, index) => {
      const foundItem = availabilityCheckedList.find(
        (item) => item.id === row.equipmentId
      );

      if (foundItem && !foundItem.isAvailable) {
        list.push(rows[index]);
      }
    });

    return list;
  }, [rows, availabilityCheckedList]);

  return (
    <>
      <GridTable<EquipmentListItemState>
        hideFooter
        getRowId={(row) => row.equipmentId}
        rows={rows}
        columns={columns}
        height={isEmpty(rows) ? "150px" : undefined}
        getRowClassName={({ row }) => {
          if (isEmpty(availabilityCheckedList)) return "";

          const selectedItem = availabilityCheckedList.find(
            (item) => item.id === row.equipmentId
          );

          if (selectedItem && !selectedItem.isAvailable)
            return "row-unavailable";

          return "";
        }}
        emptyHeight="100px"
      />
      {!isEmpty(unavailableList) && (
        <UnavailableEquipmentList unavailableList={unavailableList} />
      )}
    </>
  );
};
