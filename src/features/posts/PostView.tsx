import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Loader from "../../components/Loader";
import { fetchPostBySlug } from "./postsSlice";
import ErrorMessage from "../../components/ErrorMessage";
import NoResults from "../../components/NoResults";
import AnimatedLink from "../../components/AnimatedLink";

const PostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { post, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
  }, [dispatch, slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage />;
  if (!post) return <NoResults message="No post found." />;

  return (
    <section className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h1 className="text-3xl md:text-4xl font-bold text-primaryAccent">
          {post.title}
        </h1>
        <AnimatedLink to="/blog" label="← Back to All Posts" />
      </div>
      <p className="text-textSecondary mb-4 italic">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="text-textPrimary leading-relaxed mb-8">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {post.tags?.length ? (
        <section className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              onClick={() => navigate(`/tags/${tag}`)}
              className="bg-surfaceBackground text-textSecondary text-xs px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-primaryAccent hover:text-white transition"
            >
              {tag}
            </span>
          ))}
        </section>
      ) : null}
    </section>
  );
};

export default PostView;
