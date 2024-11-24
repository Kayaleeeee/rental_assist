"use client";

import styles from "./index.module.scss";
import Link from "next/link";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import React from "react";
import { usePathname } from "next/navigation";
import { isEmpty } from "lodash";
import { Margin } from "../Margin";

type MenuItem = {
  path: string;
  title: string;
  renderIcon?: () => React.ReactNode;
  children?: MenuItem[];
};

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
    children: [
      {
        path: "/equipments",
        title: "개별 장비 리스트",
      },
      {
        path: "/equipments/sets",
        title: "풀세트 장비 리스트",
      },
    ],
  },
  // {
  //   path: "/quotes",
  //   title: "견적서 리스트",
  //   renderIcon: () => <ReceiptLongOutlinedIcon />,
  // },
  {
    path: "/users",
    title: "회원 관리",
    renderIcon: () => <PersonOutlinedIcon />,
  },
];

export const Menu = () => {
  const currentPath = usePathname();

  const renderMenu = ({
    isSub,
    path,
    renderIcon,
    children,
    title,
  }: MenuItem & {
    isSub?: boolean;
  }) => {
    const isSelected = !isSub && currentPath?.includes(path);

    return (
      <div key={path}>
        <Link
          className={isSelected ? styles.selectedItem : styles.item}
          href={path}
        >
          <div className={styles.icon}>{renderIcon?.()}</div>
          {title}
        </Link>
        {!isEmpty(children) &&
          isSelected &&
          children?.map((item) => {
            return renderMenu({ ...item, isSub: true });
          })}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <Link href={"/"}>
        <h1 className="mainTitle">{`RENTAL\nASSIST`}</h1>
      </Link>

      <div className={styles.line} />
      <Margin top={10} />
      {menuList.map((item) => {
        return renderMenu(item);
      })}
    </div>
  );
};
