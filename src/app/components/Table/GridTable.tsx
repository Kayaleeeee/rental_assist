import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { EmptyTable } from "./EmptyTable";
import { isEmpty } from "lodash";
import { useMemo } from "react";

export const GridTable = <T extends GridValidRowModel = any>(
  props: DataGridProps<T> &
    React.RefAttributes<HTMLDivElement> & {
      height?: number;
    }
) => {
  const customHeight = useMemo(() => {
    if (isEmpty(props.rows)) {
      return 400;
    }

    if (props.height) {
      return props.height;
    }

    return "auto";
  }, [props.height, props.rows]);

  return (
    <div
      style={{
        height: customHeight,
      }}
    >
      <DataGrid<T>
        {...props}
        slots={{
          noRowsOverlay: EmptyTable,
        }}
        sx={{
          background: "white",
          width: "100%",
          flex: 1,

          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </div>
  );
};
