import { HeaderName } from "@/app/components/DataTable/HeaderName";
import {
  GROUP_EQUIPMENT_ITEM_MENU,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu/QuoteEquipmentMenu";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { GridColDef } from "@mui/x-data-grid";

export const getGroupEquipmentListColumns = ({
  onDeleteItem,
  onSelectQuantityChange,
}: {
  onDeleteItem: (id: EquipmentListItemType["id"]) => void;
  onSelectQuantityChange: (row: EquipmentListItemType) => void;
}): GridColDef<EquipmentListItemType>[] => {
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
            menu={GROUP_EQUIPMENT_ITEM_MENU}
            onConfirm={(menu) => {
              if (!menu) return;

              if (menu.key === "delete") {
                onDeleteItem(row.id);
                return;
              }

              if (menu.key === "quantity") {
                onSelectQuantityChange(row);
                return;
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
};
