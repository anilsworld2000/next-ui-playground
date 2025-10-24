export type Variant =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'dark'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'ghost'
  | 'outline'
  | 'elevated'
  | 'flat';
export const variantStyles: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700',
  light: 'bg-white text-gray-900 border',
  dark: 'bg-gray-800 text-white',
  neutral: 'bg-gray-200 text-gray-800',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  info: 'bg-sky-500 text-white hover:bg-sky-600',
  muted: 'bg-gray-100 text-gray-500',
  ghost: 'bg-transparent hover:bg-gray-100',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-400',
  elevated: 'shadow-lg bg-white',
  flat: 'bg-transparent border-none shadow-none',
};
export const variantList = Object.keys(variantStyles) as Variant[];

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const sizeStyles: Record<string, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3',
  xl: 'text-xl px-6 py-3.5',
  'full': 'p-2'
};
export const sizeList = Object.keys(sizeStyles) as Size[];

export const iconSizeMap: Record<Size, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

export type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export const roundedStyles: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
 '2xl': 'rounded-2xl',
  full: 'rounded-full',
};
export const roundedList = Object.keys(roundedStyles) as Rounded[];

type cursor = 'pointer' | 'default' | 'not-allowed' | 'wait' | 'text' | 'move';
export const cursorStyles: Record<NonNullable<string>, string> = {
  pointer: 'cursor-pointer',
  default: 'cursor-default',
  'not-allowed': 'cursor-not-allowed',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
};
export const cursorList = Object.keys(cursorStyles) as cursor[];

export const textVariantStyles: Record<Variant, string> = {
  primary: 'text-blue-600',
  secondary: 'text-purple-600',
  light: 'text-gray-100',
  dark: 'text-gray-900',
  neutral: 'text-gray-700',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-sky-600',
  muted: 'text-gray-400',
  ghost: 'text-gray-500',
  outline: 'text-gray-700',
  elevated: 'text-black',
  flat: 'text-gray-800',
};

export type Status = 'online' | 'offline' | 'busy' | 'away' | 'dnd';

export const statusColorMap: Record<Status, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-400',
  dnd: 'bg-pink-500',
};

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export const textAlignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export type Position = 'top' | 'bottom' | 'center' |'left' | 'right';

export type Resize = 'none' | 'both' | 'horizontal' | 'vertical';

export type Orientation = 'horizontal' | 'vertical';

export type Alignment = 'start' | 'center' | 'end' | 'justify';