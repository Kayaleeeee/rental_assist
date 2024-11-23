import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { EmptyTable } from "./EmptyTable";
import { isEmpty } from "lodash";

export const GridTable = <T extends GridValidRowModel = any>(
  props: DataGridProps<T> & React.RefAttributes<HTMLDivElement>
) => {
  return (
    <DataGrid<T>
      {...props}
      slots={{
        noRowsOverlay: EmptyTable,
      }}
      sx={{
        background: "white",
        width: "100%",
        flex: 1,
        height: isEmpty(props.rows) ? "400px" : "auto",
        borderRadius: "16px",
        marginTop: "24px",
      }}
    />
  );
};
