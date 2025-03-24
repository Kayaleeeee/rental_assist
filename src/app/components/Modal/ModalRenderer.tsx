import { ModalType } from "./useModal";
import { UserSearchModal } from "@/app/users/modules/UserSearchModal";
import { RoundChangeModal } from "@/app/reservations/modules/form/RoundChangeModal";
import { ReservationStatusChangeModal } from "@/app/reservations/modules/list/StatusChangeModal";
import { PaymentStatusChangeModal } from "@/app/reservations/modules/list/PaymentStatusChangeModal";
import { PriceSettingModal } from "@/app/equipments/modules/PriceSettingModal/PriceSettingModal";
import { RentalDateChangeModal } from "@/app/reservations/modules/list/RentalDateChangeModal";
import { DiscountModal } from "@/app/reservations/modules/DiscountModal";
import { AvailableEquipmentSearchModal } from "@/app/equipments/modules/AvailableEquipmentSearchModal";
import { AvailableGroupEquipmentModal } from "@/app/equipments/sets/modules/AvailableGroupEquipmentModal/AvailableGroupEquipmentModal";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  modal: ModalType;
  onCloseModal: () => void;
};

export const ModalRenderer = ({ modal, onCloseModal }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const el = document.getElementById("modal-root");
    setModalRoot(el);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || !modalRoot) return null;

  if (!modal) return null;

  const renderModal = () => {
    switch (modal.name) {
      case "equipmentSearch":
        return (
          <AvailableEquipmentSearchModal
            {...modal.props}
            onCloseModal={onCloseModal}
          />
        );
      case "groupEquipmentSearch":
        return (
          <AvailableGroupEquipmentModal
            {...modal.props}
            onCloseModal={onCloseModal}
          />
        );
      case "userSearch":
        return <UserSearchModal {...modal.props} onCloseModal={onCloseModal} />;
      case "round":
        return (
          <RoundChangeModal {...modal.props} onCloseModal={onCloseModal} />
        );
      case "reservationStatusChange":
        return (
          <ReservationStatusChangeModal
            {...modal.props}
            onCloseModal={onCloseModal}
          />
        );
      case "paymentStatusChange":
        return (
          <PaymentStatusChangeModal
            {...modal.props}
            onCloseModal={onCloseModal}
          />
        );
      case "priceSetting":
        return (
          <PriceSettingModal {...modal.props} onCloseModal={onCloseModal} />
        );
      case "rentalDateChange":
        return (
          <RentalDateChangeModal {...modal.props} onCloseModal={onCloseModal} />
        );
      case "reservationDiscount":
        return <DiscountModal {...modal.props} onCloseModal={onCloseModal} />;
      default:
        return null;
    }
  };

  return createPortal(renderModal(), modalRoot);
};
