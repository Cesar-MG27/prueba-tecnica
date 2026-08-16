import type { CSSProperties } from 'react';
import { cx } from '@/utils/cx';
import styles from './Icon.module.css';

/**
 * Icono unico de toda la interfaz.
 *
 * Los assets se pintan con `mask-image` en lugar de <img>: la forma sale del
 * canal alfa del archivo y el color lo pone `currentColor`. Asi el mismo pin
 * puede ir gris en la lista y oscuro sobre el circulo amarillo del detalle sin
 * necesitar dos archivos, y sustituir un PNG por su SVG no requiere tocar codigo.
 *
 * Los nombres que todavia no tienen archivo caen al placeholder.
 */

export type IconName =
  | 'chevron-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'bell'
  | 'search'
  | 'close'
  | 'eye'
  | 'check'
  | 'pin-pickup'
  | 'pin-dropoff'
  | 'calendar'
  | 'clock'
  | 'phone'
  | 'mail'
  | 'user'
  | 'truck'
  | 'fcl'
  | 'ftl'
  | 'inbox'
  | 'alert';

/** Archivos disponibles en `public/icons`. */
const ICON_ASSETS: Partial<Record<IconName, string>> = {
  'chevron-left': '/icons/back-icon.png',
  // Las dos flechas del acordeon salen del mismo chevron girado.
  'chevron-down': '/icons/back-icon.png',
  'chevron-up': '/icons/back-icon.png',
  bell: '/icons/notification-icon.png',
  search: '/icons/search-icon.png',
  check: '/icons/check-icon.png',
  'pin-dropoff': '/icons/pin-icon.png',
  'pin-pickup': '/icons/truck-icon.svg',
  truck: '/icons/truck-icon.svg',
  eye: '/icons/show-icon.svg',
  fcl: '/icons/fcl-icon.png',
  ftl: '/icons/ftl-icon.png',
};

/** Proporcion ancho/alto de los assets que no son cuadrados. */
const ICON_RATIO: Partial<Record<IconName, number>> = {
  'chevron-left': 10 / 18,
  'chevron-down': 10 / 18,
  'chevron-up': 10 / 18,
  bell: 24 / 26,
  check: 13 / 10,
  'pin-dropoff': 14 / 18,
  'pin-pickup': 28 / 19,
  truck: 28 / 19,
  eye: 21 / 16,
  fcl: 27 / 15,
  ftl: 41 / 14,
};

/**
 * Giro base del asset, en grados. Va en la propiedad `rotate` y no en
 * `transform` para no pisar las animaciones que los componentes aplican encima
 * (el acordeon voltea su flecha con `transform`).
 */
const ICON_ROTATION: Partial<Record<IconName, number>> = {
  'chevron-down': -90,
  'chevron-up': 90,
};

interface IconProps {
  name: IconName;
  /** Alto en px; el ancho se ajusta a la proporcion del asset. */
  size?: number;
  className?: string;
  /** Si se pasa, el icono deja de ser decorativo y se anuncia con este texto. */
  title?: string;
}

export function Icon({ name, size = 20, className, title }: IconProps) {
  const asset = ICON_ASSETS[name];

  const a11y = title
    ? ({ role: 'img', 'aria-label': title } as const)
    : ({ 'aria-hidden': true } as const);

  if (asset) {
    const rotation = ICON_ROTATION[name];

    const maskStyle = {
      height: size,
      width: Math.round(size * (ICON_RATIO[name] ?? 1)),
      maskImage: `url("${asset}")`,
      WebkitMaskImage: `url("${asset}")`,
      ...(rotation ? { rotate: `${rotation}deg` } : null),
    } as CSSProperties;

    return (
      <span
        className={cx(styles.icon, styles.masked, className)}
        data-icon={name}
        style={maskStyle}
        {...a11y}
      />
    );
  }

  // Placeholder para los iconos que aun no llegan.
  return (
    <svg
      className={cx(styles.icon, className)}
      data-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...a11y}
    >
      {title ? <title>{title}</title> : null}
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
