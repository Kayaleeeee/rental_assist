import { isNil } from "lodash";
import styles from "./timeSlot.module.scss";
import {
  buildHourCell,
  HourCell,
  ReservedCell,
} from "./utils/buildReservedCellMap";
import { getRandomHexColor } from "@/app/utils/colorUtils";
import { Tooltip } from "@mui/material";
import { useState } from "react";

type Props = {
  cellId?: string;
  reservationCell: ReservedCell[];
  style?: React.CSSProperties;
};

export const DaySlot = ({ cellId, style, reservationCell }: Props) => {
  const [tooltipId, setTooltipId] = useState(-1);
  const hourCell: HourCell[] = buildHourCell(reservationCell);
  const generateCellClassName = (id: string | number) => {
    return `cell-id-${cellId ? cellId + "-" : ""}${id}`;
  };

  return (
    <div
      className={styles.dayItem}
      style={{
        ...style,
      }}
    >
      {hourCell.map((cell, index) => {
        const isLastCell = index === hourCell.length - 1;
        const reservationColor = !isNil(cell.reservationId)
          ? getRandomHexColor(cell.reservationId)
          : "white";

        const onClickCell = () => {
          if (!cell.reservationId) return;

          setTooltipId(cell.reservationId);
        };

        const borderRightColor = () => {
          if (isLastCell && !!cell.reservationId) {
            return reservationColor;
          }

          if (isLastCell && !cell.reservationId) {
            return "black";
          }

          return "var(--grey-1)";
        };

        return (
          <Tooltip
            key={index}
            title={cell.title}
            open={tooltipId === cell.reservationId}
            slotProps={{
              tooltip: {
                style: { margin: "2px" },
              },
            }}
            onClose={() => setTooltipId(-1)}
            placement="top"
          >
            <div
              onClick={onClickCell}
              className={
                cell.reservationId
                  ? generateCellClassName(cell.reservationId)
                  : undefined
              }
              style={{
                display: "flex",
                flex: cell.count,
                height: "100%",
                alignItems: "center",
                borderRight: `1px solid ${borderRightColor()}`,
                backgroundColor: reservationColor,
              }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
