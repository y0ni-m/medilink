'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, type Categories, DEFAULT_CATEGORIES, getCategories, subscribe } from '@/lib/consent';

/** Ad-account pixel for medilink.vip. Fires PageView on mount; conversions are sent by trackMeta(). */
export const META_PIXEL_ID = '1070112295758785';

const META_PIXEL_SNIPPET = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
`;

/**
 * The gate every non-essential tag has to pass through.
 *
 * Third-party scripts are *not rendered at all* until the matching category is granted, so no
 * request ever leaves the browser without consent — which is the part a banner alone does not
 * achieve. Granting a category mounts the script immediately; revoking one triggers a reload
 * from the consent engine, because an executed script cannot be taken back.
 *
 * To add a vendor later: add its row to CATEGORY_META in lib/consent.ts, then render it here
 * behind the right category. Do not add scripts to layout.tsx directly.
 */
export default function ConsentScripts() {
  const [categories, setCategories] = useState<Categories>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const sync = () => setCategories(getCategories());
    sync();
    const unsubscribe = subscribe(sync);
    window.addEventListener(CONSENT_EVENT, sync);
    // Keep tabs in step: a decision made in one tab applies everywhere.
    window.addEventListener('storage', sync);
    return () => {
      unsubscribe();
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <>
      {categories.marketing && (
        /* Leadsy / vtag business-visitor identification — marketing category. */
        <Script
          id="vtag-ai-js"
          src="https://r2.leadsy.ai/tag.js"
          strategy="afterInteractive"
          data-pid="EBqydQhZY0l1wstN"
          data-version="062024"
        />
      )}
      {categories.marketing && (
        /* Meta pixel — marketing category. Loading the snippet here (rather than in layout)
           is what keeps connect.facebook.net unrequested until marketing is granted. */
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }}
        />
      )}
    </>
  );
}
