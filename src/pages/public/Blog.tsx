import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/ui/SectionHeader';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockPosts } from '../../data/mockData';
import type { Post } from '../../types';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  useEffect(() => {
    listDocs<Post>(COLLECTIONS.posts)
      .then((docs) => {
        const published = docs.filter((p) => p.published);
        if (published.length) setPosts(published);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <SectionHeader eyebrow="Blog & news" title="Updates, insights, and announcements" />

      <div className="mx-auto grid max-w-3xl gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="card-interactive block overflow-hidden p-0 group"
          >
            <div className="flex flex-col md:flex-row">
              {post.coverImage && (
                <div className="w-full md:w-56 shrink-0 aspect-[16/10] md:aspect-auto overflow-hidden relative border-b md:border-b-0 md:border-r border-line">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-void/40 to-transparent" />
                  <div className="scan-line hidden group-hover:block" />
                </div>
              )}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-circuit font-semibold">
                      {post.type}
                    </span>
                    <span className="text-xs text-ink-muted">{post.publishedAt}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-circuit-bright">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim line-clamp-2">{post.excerpt}</p>
                </div>
                {(post.tags?.length ?? 0) > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line bg-panel2 px-2 py-0.5 text-[11px] text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
