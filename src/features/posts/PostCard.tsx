import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
}

const FENCED_CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
const INLINE_CODE_REGEX = /`([^`]+)`/g;
const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\([^)]+\)/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
const BLOCK_MARKER_REGEX = /^\s{0,3}(#{1,6}\s+|>\s+|[-*+]\s+|\d+\.\s+)/gm;
const EMPHASIS_REGEX = /(\*\*|__|\*|_)/g;
const WHITESPACE_REGEX = /\s+/g;

export const stripMarkdown = (text: string): string => {
  return text
    .replace(FENCED_CODE_BLOCK_REGEX, " ")
    .replace(INLINE_CODE_REGEX, "$1")
    .replace(MARKDOWN_IMAGE_REGEX, "$1")
    .replace(MARKDOWN_LINK_REGEX, "$1")
    .replace(BLOCK_MARKER_REGEX, "")
    .replace(EMPHASIS_REGEX, "")
    .replace(WHITESPACE_REGEX, " ")
    .trim();
};

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const plainContent = stripMarkdown(post.content);
  const previewContent =
    plainContent.length > 150
      ? `${plainContent.slice(0, 150)}...`
      : plainContent;

  return (
    <article
      className="bg-cardBackground border border-borderPrimary rounded-xl p-4 md:p-6 shadow-sm hover:border-primaryAccent hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/posts/${post.slug}`)}
    >
      <h3 className="text-2xl font-semibold text-primaryAccent mb-2 group-hover:text-hoverTextAccent transition">
        {post.title}
      </h3>
      <p className="text-base text-textSecondary leading-relaxed">
        {previewContent}
      </p>

      {post.tags?.length ? (
        <section className="flex flex-wrap gap-1.5 mt-2 md:mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tags/${tag}`);
              }}
              className="bg-borderPrimary text-textSecondary text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer hover:bg-primaryAccent hover:text-white transition"
            >
              {tag}
            </span>
          ))}
        </section>
      ) : null}
    </article>
  );
};

export default PostCard;
