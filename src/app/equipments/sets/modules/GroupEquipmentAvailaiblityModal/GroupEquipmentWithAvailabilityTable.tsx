import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentWithAvailabilityType } from "@/app/types/equipmentType";
import { GridColDef } from "@mui/x-data-grid";
import { isEmpty } from "lodash";

const getColumns = (): GridColDef<EquipmentWithAvailabilityType>[] => [
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
  {
    field: "isAvailable",
    renderHeader: () => HeaderName("예약 가능여부"),
    renderCell: ({ row }) => (
      <div
        style={{
          fontWeight: 700,
          color: row.isAvailable ? "black" : "red",
        }}
      >
        {row.isAvailable ? "가능" : "불가"}
      </div>
    ),
  },
];

type Props = {
  equipmentList: EquipmentWithAvailabilityType[];
  selectedEquipmentList?: EquipmentWithAvailabilityType[];
  disabledEquipmentIdList?: number[];
  isAllSelected?: boolean;
  toggleEquipmentItem?: (item: EquipmentWithAvailabilityType) => void;
  checkboxSelection?: boolean;
};

export const GroupEquipmentWithAvailabilityTable = ({
  equipmentList,
  isAllSelected,
  toggleEquipmentItem,
  selectedEquipmentList = [],
  disabledEquipmentIdList = [],
  checkboxSelection = true,
}: Props) => {
  return (
    <GridTable<EquipmentWithAvailabilityType>
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
