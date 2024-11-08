import { TextField, TextFieldProps } from "@mui/material";
import styles from "./index.module.scss";

type Props = {
  isEditable?: boolean;
  value: string | number;
} & Omit<TextFieldProps, "variant" | "value">;

export const EditableField = ({
  isEditable = true,
  value,
  ...props
}: Props) => {
  return isEditable ? (
    <TextField {...props} value={value} />
  ) : (
    <div className={styles.valueWrapper}>{value}</div>
  );
};
