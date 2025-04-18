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
import { isEmpty, isNil } from "lodash";
import {
  GROUP_QUOTE_ITEM_MENU,
  GROUP_QUOTE_MENU,
  QuoteEquipmentMoreMenu,
} from "@/app/reservations/modules/form/QuoteEquipmentMenu/QuoteEquipmentMenu";
import { useMemo } from "react";
import { Margin } from "@/app/components/Margin";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { UnavailableEquipmentList } from "../UnavailableEquipmentList";
import { useModal } from "@/app/components/Modal/useModal";

type Props = {
  rounds: number;
  groupEquipment: SetEquipmentStateType;
  onClickAddEquipment: () => void;
  deleteSetEquipment: () => void;
  changeSetEquipment: (set: SetEquipmentStateType) => void;
  availabilityCheckedList: EquipmentAvailableItem[];
};

export const ReservationGroupTableEditor = ({
  rounds,
  groupEquipment,
  onClickAddEquipment,
  deleteSetEquipment,
  changeSetEquipment,
  availabilityCheckedList,
}: Props) => {
  const { openModal } = useModal();

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
  }, [groupEquipment]);

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

  const openPriceChangeModal = () => {
    openModal({
      name: "equipmentPriceChange",
      props: {
        currentTotalPrice: groupEquipment.price,
        currentDiscountPrice: groupEquipment.discountPrice || 0,
        onConfirm: (price) =>
          changeSetEquipment({ ...groupEquipment, discountPrice: price }),
      },
    });
  };

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
                openPriceChangeModal();
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

        <div className={styles.footer}>
          <Margin top={4} />
          <div className={styles.supplyPrice}>
            {`${rounds}회차 ${formatLocaleString(groupEquipment.price)} 원 `}
          </div>
          {!isNil(groupEquipment.discountPrice) &&
            groupEquipment.discountPrice !== 0 && (
              <div className={styles.supplyPrice}>
                <b>조정 금액 :</b>
                {` ${
                  groupEquipment.discountPrice > 0 ? "-" : "+"
                }${formatLocaleString(groupEquipment.discountPrice)} 원`}
              </div>
            )}
          <div className={styles.totalPrice}>
            {`총 ${formatLocaleString(
              getEquipmentGroupTotalPrice({
                price: groupEquipment.price,
                discountPrice: groupEquipment.discountPrice,
              })
            )} 원`}
          </div>
        </div>
      </div>
      {!isEmpty(unavailableList) && (
        <UnavailableEquipmentList unavailableList={unavailableList} />
      )}
    </>
  );
};
