import PostsList from "../features/posts/PostsList";
import React from "react";
import { useAppSelector } from "../app/hooks";
import AnimatedLink from "./AnimatedLink";

const LatestBlogPosts = () => {
  const { posts } = useAppSelector((state) => state.posts);

  return (
    <section id="blog" className="space-y-4">
      <h2 className="text-3xl font-semibold text-white">Latest Blog Postss</h2>
      <PostsList limit={3} />
      {posts.length >= 3 && (
        <div className="flex justify-end mt-4">
          <AnimatedLink to="/blog" label="View More →" />
        </div>
      )}
    </section>
  );
};

export default LatestBlogPosts;
