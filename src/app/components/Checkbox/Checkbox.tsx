import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

export const CustomCheckbox = styled(Checkbox)(() => ({
  color: "var(--primary)",
  "&.Mui-checked": {
    color: "var(--primary)",
  },
}));
