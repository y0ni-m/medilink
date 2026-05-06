import type { Metadata } from 'next';
import '../styles.css';
import '../pricing.css';
import '../onboarding.css';

export const metadata: Metadata = {
  title: 'MediLink — Personal injury referrals, matched in minutes.',
  description:
    'MediLink connects personal injury clinics with vetted attorneys actively placing referrals. Join 1,800+ clinics on the trusted network for injury care.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
