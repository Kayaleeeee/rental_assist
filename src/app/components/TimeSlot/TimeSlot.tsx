import styles from "./timeSlot.module.scss";
import { buildReservedCellMap } from "./utils/buildReservedCellMap";
import { DaySlot } from "./DaySlot";
import { addDays } from "@/app/utils/timeUtils";
import dayjs from "dayjs";

// day, week, month 로 변경할 수 있는 UI
// 날짜 어떻게 계산할지?

type Props = {};

const days = Array(31).fill(0);

const list = [
  {
    title: "SONY FX",
    reservation: [
      {
        startDate: "2025-05-01T10:00:00Z",
        endDate: "2025-05-01T19:30:00Z",
        reservationId: 1,
        userName: "홍길동",
      },
      {
        startDate: "2025-05-06T10:00:00Z",
        endDate: "2025-05-11T12:30:00Z",
        reservationId: 2,
        userName: "이가연",
      },
    ],
  },
  {
    title: "SONY FX 2",
    reservation: [
      {
        startDate: "2025-05-10T07:00:00Z",
        endDate: "2025-05-12T19:30:00Z",
        reservationId: 1,
        userName: "홍길동",
      },
      {
        startDate: "2025-05-16T10:00:00Z",
        endDate: "2025-05-17T12:30:00Z",
        reservationId: 4,
        userName: "민병휘",
      },
    ],
  },
  { title: "SONY FX 3", reservation: [] },
];

export const TimeSlot = () => {
  const currentDate = dayjs().set("date", 1);

  const getDate = (index: number) =>
    addDays(currentDate.toString(), index, "YYYY-MM-DD");

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemListWrapper}>
        <div className={styles.item} />

        {/* 장비 리스트 */}
        {list.map((item, index) => (
          <div key={`${item.title}_${index}`} className={styles.item}>
            {item.title}
          </div>
        ))}
      </div>

      {/* 날짜 Header */}
      <div className={styles.timeWrapper}>
        <div className={styles.timeItemRow}>
          {days.map((_, dayIndex) => {
            return (
              <div
                key={`dayItem_${dayIndex + 1}`}
                className={styles.timeItem}
                style={{
                  borderBottom: "1px solid black",
                  fontWeight: 700,
                }}
              >
                {getDate(dayIndex)}
              </div>
            );
          })}
        </div>

        {list.map((listItem, index) => {
          const isLastRow = index === list.length - 1;
          const reservedCellMap = buildReservedCellMap(listItem.reservation);

          return (
            <div
              className={styles.timeItemRow}
              key={`cell_${index}_${listItem.title}`}
            >
              {days.map((_, dayIndex) => {
                const dateKey = getDate(dayIndex);

                return (
                  <DaySlot
                    key={dateKey}
                    reservationCell={reservedCellMap.get(dateKey) || []}
                    style={{
                      borderBottom: isLastRow ? "none" : "1px solid black",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
