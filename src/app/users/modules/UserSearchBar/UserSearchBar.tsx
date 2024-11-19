import { Button } from "@/app/components/Button";
import styles from "./userSearchBar.module.scss";
import { MenuItem, Select, TextField } from "@mui/material";

const userMenu = [
  {
    key: "name",
    title: "이름",
  },
  {
    key: "email",
    title: "이메일",
  },
  {
    key: "phoneNumber",
    title: "전화번호",
  },
];

type Props = {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  searchKey: string;
  onChangeSearchKey: (searchKey: string) => void;
  onSearch: () => void;
};

export const UserSearchBar = ({
  keyword,
  onChangeKeyword,
  searchKey,
  onChangeSearchKey,
  onSearch,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <Select<string>
        value={searchKey}
        onChange={(event) => {
          const value = event.target.value;
          onChangeSearchKey(value);
        }}
        sx={{
          width: "150px",
        }}
      >
        {userMenu.map((category) => {
          return (
            <MenuItem value={category.key} key={category.key}>
              {category.title}
            </MenuItem>
          );
        })}
      </Select>
      <TextField
        fullWidth
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />
      <Button
        size="Medium"
        style={{
          height: "56px",
          width: "100px",
        }}
        onClick={onSearch}
      >
        검색
      </Button>
    </div>
  );
};
