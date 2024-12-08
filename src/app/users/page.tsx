"use client";

import formStyles from "@components/Form/index.module.scss";
import { Button } from "@components/Button";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { UserType } from "../types/userType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { useUserList } from "./hooks/useUserList";
import { formatPhoneNumber } from "../utils/textUtils";

const columns: GridColDef<UserType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "name",
    renderHeader: () => HeaderName("이름"),
    flex: 1,
  },
  {
    field: "email",
    renderHeader: () => HeaderName("이메일"),
    flex: 1,
  },
  {
    field: "phoneNumber",
    flex: 1,
    renderHeader: () => HeaderName("전화번호"),
    renderCell: ({ row }) => <>{formatPhoneNumber(row.phoneNumber || "")}</>,
  },
];

const UserListPage = () => {
  const router = useRouter();
  const { list } = useUserList();

  return (
    <div>
      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/users/create")}
        >
          회원 등록하기
        </Button>
      </div>
      <DataGrid<UserType>
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        onCellClick={(cell) => router.push(`/users/${cell.id}`)}
        sx={{
          background: "white",
          width: "100%",
          minHeight: "400px",
          flex: 1,
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </div>
  );
};

export default UserListPage;
