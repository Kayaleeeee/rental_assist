import { useMemo, useState } from "react";
import styles from "./sheduleList.module.scss";
import { ScheduleItemType } from "@/app/types/ScheduleType";
import { CategoryList } from "@/app/components/Category/CategoryList";
import { formatDateTimeWithLocale } from "@/app/utils/timeUtils";
import { Margin } from "@/app/components/Margin";
import { getRandomHexColor } from "@/app/utils/colorUtils";

type Props = {
  startList: ScheduleItemType[];
  endList: ScheduleItemType[];
};

const categoryList = [
  { key: "start", title: "대여" },
  { key: "end", title: "반납" },
];

const sortByTime = (list: ScheduleItemType[]) => {
  const sortList = [...list];
  return sortList.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const ScheduleList = ({ startList, endList }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryList[0].key
  );

  const list = useMemo(() => {
    return selectedCategory === "start"
      ? sortByTime(startList)
      : sortByTime(endList);
  }, [selectedCategory, startList, endList]);

  return (
    <div className={styles.wrapper}>
      <CategoryList
        type="borderless"
        categoryList={categoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
      />
      <Margin top={20} />
      <div className={styles.listWrapper}>
        {list.map((item) => {
          return (
            <div key={item.id} className={styles.itemWrapper}>
              <div
                className={styles.colorDot}
                style={{
                  background: item.userId
                    ? getRandomHexColor(item.userId)
                    : undefined,
                }}
              />
              <div>{item.type === "start" ? "대여" : "반납"}</div>
              <div className={styles.dateWrapper}>
                {formatDateTimeWithLocale(item.date)}
              </div>

              <div>{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
