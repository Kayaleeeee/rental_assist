"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { ModalRenderer } from "./ModalRenderer";
import { UserSearchModalProps } from "@/app/users/modules/UserSearchModal";
import { RoundChangeModalProps } from "@/app/reservations/modules/form/RoundChangeModal";
import { ReservationStatusChangeModalProps } from "@/app/reservations/modules/list/StatusChangeModal";
import { PriceSettingModalProps } from "@/app/equipments/modules/PriceSettingModal/PriceSettingModal";
import { RentalDateChangeModalProps } from "@/app/reservations/modules/list/RentalDateChangeModal";
import { PaymentStatusChangeModalProps } from "@/app/reservations/modules/list/PaymentStatusChangeModal";
import { DiscountModalProps } from "@/app/reservations/modules/DiscountModal";
import { AvailableEquipmentSearchModalProps } from "@/app/equipments/modules/AvailableEquipmentSearchModal";
import { AvailableGroupEquipmentModalProps } from "@/app/equipments/sets/modules/AvailableGroupEquipmentModal/AvailableGroupEquipmentModal";

export interface ModalBasicProps {
  onCloseModal: () => void;
}

type ModalProps<T> = Omit<T, "onCloseModal">;

export type ModalType =
  | {
      name: "equipmentSearch";
      props: ModalProps<AvailableEquipmentSearchModalProps>;
    }
  | {
      name: "groupEquipmentSearch";
      props: ModalProps<AvailableGroupEquipmentModalProps>;
    }
  | { name: "userSearch"; props: ModalProps<UserSearchModalProps> }
  | { name: "round"; props: ModalProps<RoundChangeModalProps> }
  | {
      name: "reservationStatusChange";
      props: ModalProps<ReservationStatusChangeModalProps>;
    }
  | {
      name: "reservationDiscount";
      props: ModalProps<DiscountModalProps>;
    }
  | {
      name: "paymentStatusChange";
      props: ModalProps<PaymentStatusChangeModalProps>;
    }
  | { name: "priceSetting"; props: ModalProps<PriceSettingModalProps> }
  | { name: "rentalDateChange"; props: ModalProps<RentalDateChangeModalProps> }
  | null;

const ModalContext = createContext<{
  modal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}>({
  modal: null,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modal, setModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => {
    setModal(modal);
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
      }}
    >
      {children}
      <ModalRenderer modal={modal} onCloseModal={closeModal} />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
