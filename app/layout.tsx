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

export const metadata: Metadata = {
  title: 'MediLink — Personal injury referrals, in one shared workspace.',
  description:
    'MediLink connects personal injury clinics with vetted attorneys actively placing referrals — referrals, LOP and/or Patient financial responsibility depending on what state you are operating in, and case tracking in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
        {/* Leadsy / vtag visitor tag */}
        <Script
          id="vtag-ai-js"
          src="https://r2.leadsy.ai/tag.js"
          strategy="afterInteractive"
          data-pid="EBqydQhZY0l1wstN"
          data-version="062024"
        />
      </body>
    </html>
  );
}
