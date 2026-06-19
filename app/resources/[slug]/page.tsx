import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import PostBody from '@/components/PostBody';
import {
  formatDate,
  getCategory,
  getPost,
  postSlugs,
  sortedPosts,
} from '@/lib/resources';

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'MediLink — Resources' };
  return {
    title: `${post.title} — MediLink`,
    description: post.excerpt,
  };
}

export const dynamicParams = false;

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const more = sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="page">
      <Nav />
      <main className="post">
        <article className="post-article">
          <div className="post-inner">
            <Link className="post-back" href="/resources">
              <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All resources
            </Link>

            <header className="post-head">
              {category && (
                <Link className="post-cat" href={`/resources?category=${category.slug}`}>
                  {category.name}
                </Link>
              )}
              <h1 className="post-title">{post.title}</h1>
              <p className="post-lede">{post.excerpt}</p>
              <div className="post-meta">
                <span className="post-author">{post.author.name}</span>
                <span className="post-meta-sep">·</span>
                <span>{post.author.role}</span>
                <span className="post-meta-sep">·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="post-meta-sep">·</span>
                <span>{post.readMinutes} min read</span>
              </div>
            </header>

            <PostBody blocks={post.body} />

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((t) => (
                  <span className="post-tag" key={t}>#{t}</span>
                ))}
              </div>
            )}

            <div className="post-disclaimer">
              MediLink does not provide legal advice. This article is general information; confirm
              the rules that apply in your jurisdiction with qualified counsel.
            </div>
          </div>
        </article>

        {more.length > 0 && (
          <section className="post-more">
            <div className="post-inner">
              <h2 className="post-more-title">More from Resources</h2>
              <div className="post-more-grid">
                {more.map((p) => {
                  const c = getCategory(p.category);
                  return (
                    <Link className="post-more-card" href={`/resources/${p.slug}`} key={p.slug}>
                      {c && <span className="post-more-cat">{c.name}</span>}
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <span className="post-more-read">{p.readMinutes} min read →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
