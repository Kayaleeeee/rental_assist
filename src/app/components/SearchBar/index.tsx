import { MenuItem, Select, TextField } from "@mui/material";
import styles from "./index.module.scss";
import { Button } from "../Button";

type Props<T> = {
  selectedKey: T;
  menuList: { key: T; title: string }[];
  keyword: string;
  onChangeSearchKey: (searchKey: T) => void;
  onChangeKeyword: (keyword: string) => void;
  onSearch: () => void;
};

export const SearchBar = <T extends string>({
  selectedKey,
  menuList,
  keyword,
  onSearch,
  onChangeSearchKey,
  onChangeKeyword,
}: Props<T>) => {
  return (
    <div className={styles.wrapper}>
      <Select<T>
        value={selectedKey}
        onChange={(event) => {
          const value = event.target.value as T;
          onChangeSearchKey(value);
        }}
        sx={{
          width: "150px",
          height: "40px",
          background: "#fff",
        }}
      >
        {menuList.map((menu) => {
          return (
            <MenuItem value={menu.key} key={`${menu}`}>
              {menu.title}
            </MenuItem>
          );
        })}
      </Select>
      <TextField
        fullWidth
        value={keyword}
        className={styles.textInput}
        onChange={(e) => onChangeKeyword(e.target.value)}
        size="small"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />
      <Button
        size="Small"
        style={{
          height: "40px",
          width: "100px",
        }}
        onClick={onSearch}
      >
        검색
      </Button>
    </div>
  );
};
