import styles from './InfoRow.module.css';

interface InfoRowProps {
  value: string;
  href?: string;
}

/** Linea de informacion del panel de datos; con `href` se vuelve enlace (tel:/mailto:). */
export function InfoRow({ value, href }: InfoRowProps) {
  if (href) {
    return (
      <a className={styles.link} href={href}>
        {value}
      </a>
    );
  }

  return <p className={styles.row}>{value}</p>;
}
