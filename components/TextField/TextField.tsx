"use client";
import clsx from "clsx";
import styles from "./TextField.module.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function TextField({ id, label, error, className, ...rest }: Props) {
  return (
    <div className={clsx(styles.wrapper, error && styles.invalid, className)}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input id={id} className={styles.input} {...rest} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
