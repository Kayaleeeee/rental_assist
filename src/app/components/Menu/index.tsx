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

  return (
    <div className={styles.wrapper}>
      <Link href={"/"}>
        <h1 className="mainTitle">{`RENTAL\nASSIST`}</h1>
      </Link>

      <div className={styles.line}></div>
      {menuList.map((item, index) => {
        const isSelected = path?.includes(item.path);

        return (
          <Link
            className={isSelected ? styles.selectedItem : styles.item}
            key={`${item.path}_${index}`}
            href={item.path}
          >
            <div className={styles.icon}>{item.renderIcon()}</div>
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};
