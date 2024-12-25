"use client";

import styles from "./index.module.scss";
import Link from "next/link";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SubdirectoryArrowRightOutlinedIcon from "@mui/icons-material/SubdirectoryArrowRightOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isEmpty } from "lodash";
import { CartMenu } from "./CartMenu";
import { useAuthStore } from "@/app/store/useAuthStore";
import { showToast } from "@/app/utils/toastUtils";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

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
    path: "/payments",
    title: "정산 리스트",
    renderIcon: () => <ReceiptLongOutlinedIcon />,
  },
  {
    path: "/equipments",
    title: "장비 리스트",
    renderIcon: () => <FormatListBulletedOutlinedIcon />,
    children: [
      {
        path: "/equipments",
        title: "단품 장비",
        renderIcon: () => <SubdirectoryArrowRightOutlinedIcon />,
      },
      {
        path: "/equipments/sets",
        title: "풀세트",
        renderIcon: () => <SubdirectoryArrowRightOutlinedIcon />,
      },
    ],
  },
  {
    path: "/users",
    title: "회원 관리",
    renderIcon: () => <PersonOutlinedIcon />,
  },
];

export const Menu = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { user, getUser, logout } = useAuthStore();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobile(isMobile);
      if (!isMobile) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    const className = () => {
      if (isSub) return styles.subItem;
      if (isSelected) return styles.selectedItem;
      return styles.item;
    };

    return (
      <div key={title}>
        <Link
          className={className()}
          href={path}
          style={{
            padding: !isEmpty(children) ? "16px 16px 8px 16px" : undefined,
          }}
        >
          {renderIcon && <div className={styles.icon}>{renderIcon()}</div>}
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

  const handleLogout = useCallback(() => {
    try {
      logout();
      showToast({ message: "로그아웃 되었습니다.", type: "info" });
      router.replace("/login");
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleClickMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className={isMobile ? styles.mobileMenuWrapper : styles.wrapper}>
      <Link className={styles.mainTitle} href={"/"}>
        <h1>{`RENTAL\nASSIST`}</h1>

        <div
          className={styles.mobileMenu}
          onClick={(e) => {
            e.preventDefault();
            handleClickMobileMenu();
          }}
        >
          <MenuOutlinedIcon />
        </div>
      </Link>

      <div
        className={
          isMobile && !isMobileMenuOpen
            ? styles.hiddenListWrapper
            : styles.listWrapper
        }
      >
        <div>
          {menuList.map((item) => {
            return renderMenu(item);
          })}
          <CartMenu />
        </div>
        {user && (
          <div className={styles.logoutItem} onClick={handleLogout}>
            <LogoutOutlinedIcon />
            로그아웃
          </div>
        )}
      </div>
    </div>
  );
};
