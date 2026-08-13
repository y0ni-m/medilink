'use client';

import { openPreferences } from '@/lib/consent';

type Props = {
  /**
   * 'link'   — muted footer link styling.
   * 'inline' — matches body copy links inside legal pages.
   * 'button' — accent pill, used for the primary action on the cookie policy page.
   */
  variant?: 'link' | 'inline' | 'button';
  children?: React.ReactNode;
  className?: string;
};

const VARIANT_CLASS = {
  link: 'cc-settings-link',
  inline: 'cc-settings-inline',
  button: 'cc-settings-btn',
} as const;

/**
 * Persistent entry point back into the preferences dialog. GDPR Art. 7(3) requires withdrawing
 * consent to be as easy as giving it, and U.S. state laws require a standing opt-out link — so
 * this must stay reachable from every page, which is why it lives in the footer.
 */
export default function CookieSettingsLink({ variant = 'link', children, className }: Props) {
  const base = VARIANT_CLASS[variant];
  return (
    <button type="button" className={className ? `${base} ${className}` : base} onClick={openPreferences}>
      {children ?? 'Cookie settings'}
    </button>
  );
}
