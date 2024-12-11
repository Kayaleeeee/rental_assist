type Props = {
  isDisabled: boolean;
  width?: string;
};

export const EquipmentStatusBadge = ({ isDisabled, width }: Props) => {
  const statusName = isDisabled ? "사용 불가" : "사용 가능";
  const color = isDisabled ? "var(--grey)" : "var(--green)";

  return (
    <div
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        color: "white",
        fontSize: "12px",
        fontWeight: 800,
        width,
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        fontFamily: "var(--default-font)",
        textAlign: "center",
      }}
    >
      {statusName}
    </div>
  );
};
