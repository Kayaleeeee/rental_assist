type Props = {
  isBlackList: boolean;
  width?: string;
};

export const UserStatusBadge = ({ isBlackList, width }: Props) => {
  const color = isBlackList ? "#000" : "var(--green)";
  const statusName = isBlackList ? "블랙 리스트" : "정상 회원";

  return (
    <div
      style={{
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 800,
        width,
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--default-font)",
        textAlign: "center",
        ...(isBlackList
          ? {
              color: "var(--grey-1)",
              background: "#000",
            }
          : {
              border: `1px solid ${color}`,
              color,
            }),
      }}
    >
      {statusName}
    </div>
  );
};
