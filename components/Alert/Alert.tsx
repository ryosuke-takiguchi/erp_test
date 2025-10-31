import clsx from "clsx";
import styles from "./Alert.module.scss";

type Props = {
  type?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
};

export default function Alert({ type = "info", children }: Props) {
  return (
    <div role="alert" className={clsx(styles.root, styles[type])}>
      {children}
    </div>
  );
}
