"use client";

import styles from "./index.module.scss";
import Link from "next/link";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const menuList = [
  {
    path: "/reservations",
    title: "예약 리스트",
    renderIcon: () => <CalendarMonthOutlinedIcon />,
  },
  {
    path: "/equipments",
    title: "장비 리스트",
    renderIcon: () => <FormatListBulletedOutlinedIcon />,
  },
  {
    path: "/quotes",
    title: "견적서 리스트",
    renderIcon: () => <ReceiptLongOutlinedIcon />,
  },
  {
    path: "/users",
    title: "회원 관리",
    renderIcon: () => <PersonOutlinedIcon />,
  },
];

export const Menu = () => {
  const path = usePathname();
  const [isHide, setIsHide] = useState<boolean>(false);

  return (
    <div className={isHide ? styles.hiddenMenuWrapper : styles.wrapper}>
      <div
        className={styles.hideMenu}
        onClick={() => setIsHide((prev) => !prev)}
      >
        <div className={styles.icon}>
          <ArrowBackIosNewOutlinedIcon fontSize={"medium"} />
        </div>
        {!isHide && "메뉴 숨기기"}
      </div>
      {menuList.map((item, index) => {
        const isSelected = path?.includes(item.path);

        return (
          <Link
            className={isSelected ? styles.selectedItem : styles.item}
            key={`${item.path}_${index}`}
            href={item.path}
          >
            <div className={styles.icon}>{item.renderIcon()}</div>
            {!isHide && item.title}
          </Link>
        );
      })}
    </div>
  );
};
