import { Post } from "../types/Post";
import rawPosts from "./postsFallback.json";

const posts = rawPosts as Post[];

export function getFallbackPosts(limit?: number): Post[] {
  const list = [...posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  if (limit != null && limit > 0) {
    return list.slice(0, limit);
  }
  return list;
}

export function getFallbackPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFallbackPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags?.includes(tag) ?? false);
}
