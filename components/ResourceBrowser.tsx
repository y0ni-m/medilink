'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Category, Post } from '@/lib/resources';
import { formatDate } from '@/lib/resources';

type Props = {
  posts: Post[];
  categories: Category[];
  initialCategory?: string;
};

const ALL = 'all';

export default function ResourceBrowser({ posts, categories, initialCategory }: Props) {
  const valid = categories.some((c) => c.slug === initialCategory);
  const [active, setActive] = useState<string>(valid ? (initialCategory as string) : ALL);

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const visible = active === ALL ? posts : posts.filter((p) => p.category === active);

  return (
    <div className="res-browser">
      <div className="res-tabs" role="tablist" aria-label="Resource categories">
        <button
          className={`res-tab ${active === ALL ? 'is-active' : ''}`}
          onClick={() => setActive(ALL)}
          role="tab"
          aria-selected={active === ALL}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`res-tab ${active === c.slug ? 'is-active' : ''}`}
            onClick={() => setActive(c.slug)}
            role="tab"
            aria-selected={active === c.slug}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="res-grid">
        {visible.map((p) => (
          <Link className="res-card" href={`/resources/${p.slug}`} key={p.slug}>
            <div className="res-card-top">
              <span className="res-card-cat">{categoryName(p.category)}</span>
              <span className="res-card-read">{p.readMinutes} min read</span>
            </div>
            <h3 className="res-card-title">{p.title}</h3>
            <p className="res-card-excerpt">{p.excerpt}</p>
            <div className="res-card-foot">
              <span className="res-card-author">{p.author.name}</span>
              <span className="res-card-dot" aria-hidden="true">·</span>
              <time className="res-card-date" dateTime={p.date}>{formatDate(p.date)}</time>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="res-empty">No articles in this category yet — check back soon.</p>
      )}
    </div>
  );
}
