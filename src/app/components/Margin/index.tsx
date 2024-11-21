import { HTMLAttributes, PropsWithChildren } from "react";

type Props = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
} & HTMLAttributes<HTMLDivElement>;

export const Margin = ({
  top,
  right,
  bottom,
  left,
  children,
  style,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <div
      style={{
        marginTop: `${top}px`,
        marginRight: `${right}px`,
        marginBottom: `${bottom}px`,
        marginLeft: `${left}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
