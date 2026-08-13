'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, type Categories, DEFAULT_CATEGORIES, getCategories, subscribe } from '@/lib/consent';

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
    </>
  );
}
