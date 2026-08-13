import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles.css';
import '../pricing.css';
import '../solutions.css';
import '../resources.css';
import '../dossier.css';
import '../explorer.css';
import '../forms.css';
import '../photos.css';
import '../faq.css';
import '../hero-cards.css';
import '../cookies.css';
import CookieConsent from '@/components/CookieConsent';
import ConsentScripts from '@/components/ConsentScripts';

export const metadata: Metadata = {
  title: 'MediLink — Personal injury referrals, in one shared workspace.',
  description:
    'MediLink connects personal injury clinics with vetted attorneys actively placing referrals — referrals, LOP and/or Patient financial responsibility depending on what state you are operating in, and case tracking in one place.',
};

/**
 * Google Consent Mode v2 defaults. Runs before anything else so that any Google tag added later
 * starts from "denied" instead of firing once before our banner has a chance to load.
 * lib/consent.ts issues the matching `consent update` as soon as a choice exists.
 */
const CONSENT_MODE_DEFAULTS = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'granted',
  wait_for_update:500
});
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="consent-mode-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_MODE_DEFAULTS }}
        />
        {/* First in the DOM so keyboard and screen-reader users reach the choice before the page. */}
        <CookieConsent />
        <div id="root">{children}</div>
        {/* Every third-party tag lives here, behind the consent gate — never inline in a page. */}
        <ConsentScripts />
      </body>
    </html>
  );
}
