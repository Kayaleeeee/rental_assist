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

const getColumns = (): GridColDef<EquipmentListItemState>[] => [
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
];

type Props = {
  rentalDays: number;
  groupEquipment: SetEquipmentStateType;
};

export const ReservationGroupTable = ({
  rentalDays,
  groupEquipment,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.groupInfo}>
        <div className={styles.title}>{groupEquipment.title}</div>
      </div>
      <GridTable<EquipmentListItemState>
        hideFooter
        rows={groupEquipment.equipmentList}
        columns={getColumns()}
        sx={{
          border: "none",
          marginTop: 0,
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
            getEquipmentGroupTotalPrice(groupEquipment)
          )} 원`}
        </div>
      </div>
    </div>
  );
};
