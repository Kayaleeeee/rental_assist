import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { GridColDef } from "@mui/x-data-grid";
import styles from "./cartGroupTable.module.scss";
import { isEmpty } from "lodash";
import {
  GROUP_QUOTE_ITEM_MENU,
  CART_GROUP_MENU,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu/QuoteEquipmentMenu";
import { useMemo } from "react";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { UnavailableEquipmentList } from "@/app/reservations/modules/form/UnavailableEquipmentList";

type Props = {
  groupEquipment: SetEquipmentStateType;
  onClickAddEquipment: () => void;
  deleteSetEquipment: () => void;
  changeSetEquipment: (set: SetEquipmentStateType) => void;
  availabilityCheckedList: EquipmentAvailableItem[];
};

export const CartGroupTableEditor = ({
  groupEquipment,
  onClickAddEquipment,
  deleteSetEquipment,
  changeSetEquipment,
  availabilityCheckedList,
}: Props) => {
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

  const unavailableList = useMemo(() => {
    const list: EquipmentListItemState[] = [];

    groupEquipment.equipmentList.forEach((row, index) => {
      const foundItem = availabilityCheckedList.find(
        (item) => item.id === row.equipmentId
      );

      if (foundItem && !foundItem.isAvailable) {
        list.push(groupEquipment.equipmentList[index]);
      }
    });

    return list;
  }, [groupEquipment, availabilityCheckedList]);
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.groupInfo}>
          <div className={styles.title}>{groupEquipment.title}</div>
          <QuoteEquipmentMoreMenu
            menu={CART_GROUP_MENU}
            onConfirm={(menu) => {
              if (!menu) return;

              if (menu.key === "delete") {
                deleteSetEquipment();
              }

              if (menu.key === "item") {
                onClickAddEquipment();
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
          getRowClassName={({ row }) => {
            if (isEmpty(availabilityCheckedList)) return "";

            const selectedItem = availabilityCheckedList.find(
              (item) => item.id === row.equipmentId
            );

            if (selectedItem && !selectedItem.isAvailable)
              return "row-unavailable";

            return "";
          }}
        />
      </div>
      {!isEmpty(unavailableList) && (
        <UnavailableEquipmentList unavailableList={unavailableList} />
      )}
    </>
  );
};
