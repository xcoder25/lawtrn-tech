import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockPosts } from '../../data/mockData';
import type { Post } from '../../types';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(mockPosts.find((p) => p.slug === slug) ?? null);

  useEffect(() => {
    listDocs<Post>(COLLECTIONS.posts)
      .then((docs) => {
        const found = docs.find((p) => p.slug === slug);
        if (found) setPost(found);
        else if (!mockPosts.find((p) => p.slug === slug)) setPost(null);
      })
      .catch(() => {});
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl text-ink">Post not found</h1>
        <Link to="/blog" className="btn-ghost mt-6 inline-flex text-sm">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-6 md:py-24">
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-circuit"
      >
        <ArrowLeft size={14} /> All posts
      </Link>
      <span className="font-mono text-[10px] uppercase tracking-wider text-circuit font-semibold">{post.type}</span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">{post.publishedAt}</p>

      {post.coverImage && (
        <div className="relative mt-8 overflow-hidden rounded-xl border border-line shadow-elevated aspect-[21/9]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
          <div className="scan-line" />
        </div>
      )}

      <div className="circuit-divider my-10" />
      <div className="prose prose-invert max-w-none text-ink-dim">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="leading-relaxed">{post.excerpt}</p>
        )}
      </div>
    </div>
  );
}
