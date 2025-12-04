/**
 * Safely combine class names without causing hydration mismatches
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ').trim();
}

/**
 * Safely combine class names with conditional logic
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create conditional class strings safely
 */
export function conditionalClass(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * Build responsive class strings
 */
export function responsiveClass(base: string, responsive: Record<string, string> = {}): string {
  const classes = [base];
  
  Object.entries(responsive).forEach(([breakpoint, cls]) => {
    if (cls) {
      classes.push(`${breakpoint}:${cls}`);
    }
  });
  
  return classes.join(' ');
}