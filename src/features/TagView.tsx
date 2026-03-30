import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPostsByTag } from "../features/posts/postsSlice";
import PostCard from "../features/posts/PostCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import NoResults from "../components/NoResults";
import AnimatedLink from "../components/AnimatedLink";

const TagView = () => {
  const { tag } = useParams();
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (tag) {
      dispatch(fetchPostsByTag(tag));
    }
  }, [dispatch, tag]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage />;
  if (!posts.length)
    return <NoResults message="No posts found for this tag." />;

  return (
    <section className="grid gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-primaryAccent">
          Posts tagged with "{tag}"
        </h2>
        <AnimatedLink to="/blog" label="← Back to All Posts" />
      </div>
      <section className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </section>
  );
};

export default TagView;
