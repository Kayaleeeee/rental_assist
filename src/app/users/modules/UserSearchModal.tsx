import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { UserType } from "@/app/types/userType";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { UserSearchBar } from "./UserSearchBar/UserSearchBar";
import { useUserSearchList } from "../hooks/useUserSearchList";
import { isEmpty } from "lodash";
import { showToast } from "@/app/utils/toastUtils";
import { useState } from "react";
import { formatPhoneNumber } from "@/app/utils/textUtils";

const HeaderName = (name: string) => {
  return (
    <div
      style={{
        fontWeight: 900,
      }}
    >
      {name}
    </div>
  );
};

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

type Props = {
  onCloseModal: () => void;
  onConfirm: (user: UserType) => void;
};

export const UserSearchModal = ({ onCloseModal, onConfirm }: Props) => {
  const [selectedUserState, setSelectedUserState] = useState<UserType | null>(
    null
  );
  const { list, setKeyword, keyword, searchKey, setSearchKey, fetchUserList } =
    useUserSearchList();

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "400px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "추가하기",
          onClick: () => {
            if (isEmpty(list) || !selectedUserState) {
              showToast({
                message: "사용자를 선택해주세요.",
                type: "error",
              });
              return;
            }

            onConfirm(selectedUserState);
            onCloseModal();
          },
        },
      ]}
    >
      <div
        style={{
          width: "70vw",
          maxWidth: "800px",
          minHeight: "300px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            marginBottom: "24px",
          }}
        >
          <h3>사용자 검색</h3>
        </div>
        <UserSearchBar
          keyword={keyword}
          onChangeKeyword={setKeyword}
          searchKey={searchKey}
          onChangeSearchKey={setSearchKey}
          onSearch={fetchUserList}
        />
        <DataGrid<UserType>
          columns={columns}
          onCellClick={({ row }) => setSelectedUserState(row)}
          rows={list}
          getRowId={(cell) => cell.id}
          sx={{
            background: "white",
            width: "100%",
            minHeight: "200px",
            borderRadius: "16px",
            marginTop: "24px",
          }}
        />
        <Margin bottom={20} />
      </div>
    </Modal>
  );
};
