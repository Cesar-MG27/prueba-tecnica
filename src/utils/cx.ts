type ClassValue = string | false | null | undefined;

/** Une clases ignorando los valores vacios: cx(styles.base, active && styles.active) */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
