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
  reservationCell: ReservedCell[];
  style?: React.CSSProperties;
};

export const DaySlot = ({ style, reservationCell }: Props) => {
  const [tooltipId, setTooltipId] = useState(-1);
  const hourCell: HourCell[] = buildHourCell(reservationCell);

  return (
    <div
      className={styles.timeItem}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        ...style,
      }}
    >
      {hourCell.map((cell, index) => {
        const isLastCell = index === hourCell.length - 1;
        const onClickCell = () => {
          if (!cell.reservationId) return;

          setTooltipId(cell.reservationId);
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
              style={{
                display: "flex",
                flex: cell.count,
                height: "100%",
                alignItems: "center",
                borderRight: isLastCell ? "none" : "1px solid var(--grey-1)",
                backgroundColor: !isNil(cell.reservationId)
                  ? getRandomHexColor(cell.reservationId)
                  : "white",
              }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
