import { PropsWithChildren } from "react";

type Props = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export const Margin = ({
  top,
  right,
  bottom,
  left,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div
      style={{
        marginTop: `${top}px`,
        marginRight: `${right}px`,
        marginBottom: `${bottom}px`,
        marginLeft: `${left}px`,
      }}
    >
      {children}
    </div>
  );
};
