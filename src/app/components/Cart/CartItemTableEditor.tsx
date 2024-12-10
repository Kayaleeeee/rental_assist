import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { GridColDef } from "@mui/x-data-grid";
import { isEmpty, isNil } from "lodash";
import { useMemo, useState } from "react";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import {
  CART_ITEM_MENU,
  QuantityChangingModal,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { UnavailableEquipmentList } from "@/app/reservations/modules/form/UnavailableEquipmentList";

type Props = {
  rows: EquipmentListItemState[];
  onDeleteEquipment: (
    equipmentId: EquipmentListItemState["equipmentId"]
  ) => void;
  onChangeField: (item: EquipmentListItemState) => void;
  availabilityCheckedList: EquipmentAvailableItem[];
};

export const CartItemTableEditor = ({
  rows,
  onDeleteEquipment,
  onChangeField,
  availabilityCheckedList,
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
              menu={CART_ITEM_MENU}
              onConfirm={(menu) => {
                if (!menu) return;

                if (menu.key === "delete") {
                  onDeleteEquipment(row.equipmentId);
                  return;
                }

                setModalProps({
                  mode: menu.key as "quantity",
                  selectedRow: row,
                });
              }}
            />
          </div>
        ),
      },
    ];
  }, []);

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
