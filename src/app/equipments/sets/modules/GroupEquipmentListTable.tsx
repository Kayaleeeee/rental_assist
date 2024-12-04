import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { GridColDef } from "@mui/x-data-grid";
import { isEmpty } from "lodash";

const getColumns = (): GridColDef<EquipmentListItemType>[] => [
  {
    field: "__check__",
    width: 50,
    renderHeader: () => null,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
    renderCell: ({ row }) => row.id,
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
];

type Props = {
  equipmentList: EquipmentListItemType[];
  selectedEquipmentList?: EquipmentListItemType[];
  disabledEquipmentIdList?: number[];
  isAllSelected?: boolean;
  toggleEquipmentItem?: (item: EquipmentListItemType) => void;
  checkboxSelection?: boolean;
};

export const GroupEquipmentListTable = ({
  equipmentList,
  isAllSelected,
  toggleEquipmentItem,
  selectedEquipmentList = [],
  disabledEquipmentIdList = [],
  checkboxSelection = true,
}: Props) => {
  return (
    <GridTable<EquipmentListItemType>
      checkboxSelection={checkboxSelection}
      rows={equipmentList}
      hideFooter
      rowSelectionModel={
        isAllSelected
          ? equipmentList.map((item) => item.id)
          : selectedEquipmentList.map((item) => item.id)
      }
      onCellClick={({ row }) => {
        if (disabledEquipmentIdList.includes(row.id)) {
          return;
        }
        toggleEquipmentItem?.(row);
      }}
      columns={getColumns()}
      height={isEmpty(equipmentList) ? "150px" : undefined}
      emptyHeight="100px"
      sx={{
        margin: 0,
      }}
      slots={{
        baseCheckbox: CustomCheckbox,
      }}
    />
  );
};
