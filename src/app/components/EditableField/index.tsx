import { TextField, TextFieldProps } from "@mui/material";
import styles from "./index.module.scss";

type Props = {
  isEditable?: boolean;
  value?: string | number;
  fontSize?: string;
} & Omit<TextFieldProps, "variant" | "value">;

export const EditableField = ({
  isEditable = true,
  value,
  ...props
}: Props) => {
  return isEditable ? (
    <TextField
      {...props}
      value={value}
      slotProps={{
        ...props.slotProps,
        input: {
          style: {
            fontSize: props.fontSize,
          },
        },
      }}
    />
  ) : (
    <div
      className={styles.valueWrapper}
      style={{
        fontSize: props.fontSize,
      }}
    >
      {value}
    </div>
  );
};
