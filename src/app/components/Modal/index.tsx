import { HtmlHTMLAttributes, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import { Button } from "../Button";

type Props = {
  onCloseModal: () => void;
  ButtonListWrapperStyle?: HtmlHTMLAttributes<HTMLDivElement>["style"];
  ButtonProps?: {
    title: string;
    onClick: () => void | Promise<void>;
    buttonStyle?: HtmlHTMLAttributes<HTMLButtonElement>["style"];
    size?: "Small" | "Medium" | "Large";
  }[];
};

export const Modal = (props: PropsWithChildren<Props>) => {
  return (
    <>
      <div className={styles.overlay} onClick={props.onCloseModal}></div>
      <div className={styles.modalContent}>
        {props.children}
        {props.ButtonProps && (
          <div
            className={styles.buttonListWrapper}
            style={props.ButtonListWrapperStyle}
          >
            {props.ButtonProps.map((button, index) => {
              const isFirst =
                (props.ButtonProps || []).length > 1 && index === 0;

              return (
                <Button
                  key={`${button.title}_${index}`}
                  style={{
                    flex: 1,
                    ...button.buttonStyle,
                  }}
                  onClick={button.onClick}
                  size={button.size || "Medium"}
                  variant={isFirst ? "outlined" : "filled"}
                >
                  {button.title}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
