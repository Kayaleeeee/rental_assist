import formStyles from "./index.module.scss";
import { Loader } from "../Loader";

export const FormLoader = () => {
  return (
    <div className={formStyles.loaderWrapper}>
      <Loader mode="dark" />
    </div>
  );
};
