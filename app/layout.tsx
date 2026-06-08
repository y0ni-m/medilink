import type { Metadata } from 'next';
import '../styles.css';
import '../pricing.css';
import '../onboarding.css';

export const metadata: Metadata = {
  title: 'MediLink — Personal injury referrals, in one shared workspace.',
  description:
    'MediLink connects personal injury clinics with vetted attorneys actively placing referrals — referrals, LOPs / Patient financial responsibility, and case tracking in one place.',
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
