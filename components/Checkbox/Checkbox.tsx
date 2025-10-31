"use client";
import clsx from "clsx";
import styles from "./Checkbox.module.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ id, label, className, ...rest }: Props) {
  return (
    <label htmlFor={id} className={clsx(styles.wrapper, className)}>
      <input id={id} type="checkbox" className={styles.box} {...rest} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
