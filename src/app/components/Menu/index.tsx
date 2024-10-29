"use client";

import styles from "./index.module.scss";
import Link from "next/link";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useState } from "react";

const menuList = [
  {
    path: "/schedules",
    title: "스케줄 검색",
    renderIcon: () => <CalendarMonthOutlinedIcon />,
  },
  {
    path: "/equipments",
    title: "장비 리스트",
    renderIcon: () => <FormatListBulletedOutlinedIcon />,
  },
  {
    path: "/users",
    title: "회원 관리",
    renderIcon: () => <PersonOutlinedIcon />,
  },
];

export const Menu = () => {
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
        return (
          <Link
            className={styles.item}
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
