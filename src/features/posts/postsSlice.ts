import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getFallbackPostBySlug,
  getFallbackPosts,
  getFallbackPostsByTag,
} from "../../data/postsFallback";
import { Post } from "../../types/Post";

interface PostsState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

/** When true, never call the posts API; use bundled JSON only. Set REACT_APP_POSTS_FALLBACK_ONLY=false to use the API (still falls back on failure). */
const POSTS_FALLBACK_ONLY =
  process.env.REACT_APP_POSTS_FALLBACK_ONLY === "true";

/**
 * Get headers for API requests, centralized for easier maintenance.
 */
const getHeaders = () => ({
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
});

const handlePending = (state: PostsState) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilledPosts = (
  state: PostsState,
  action: PayloadAction<Post[]>,
) => {
  state.loading = false;
  state.posts = action.payload;
};

const handleFulfilledPost = (
  state: PostsState,
  action: PayloadAction<Post>,
) => {
  state.loading = false;
  state.post = action.payload;
};

const handleRejected = (state: PostsState, action: { payload?: unknown; error: { message?: string } }) => {
  state.loading = false;
  state.error =
    (typeof action.payload === "string" && action.payload) ||
    action.error.message ||
    "Failed to fetch posts";
};

/**
 * Fetch all posts with optional limit
 */
export const fetchPosts = createAsyncThunk<Post[], number | undefined>(
  "posts/fetchPosts",
  async (limit) => {
    if (POSTS_FALLBACK_ONLY) {
      return getFallbackPosts(limit);
    }
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { limit },
        headers: getHeaders(),
      });
      return response.data;
    } catch {
      return getFallbackPosts(limit);
    }
  },
);

/**
 * Fetch posts filtered by a specific tag
 */
export const fetchPostsByTag = createAsyncThunk<Post[], string>(
  "posts/fetchPostsByTag",
  async (tag) => {
    if (POSTS_FALLBACK_ONLY) {
      return getFallbackPostsByTag(tag);
    }
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { tag },
        headers: getHeaders(),
      });
      return response.data;
    } catch {
      return getFallbackPostsByTag(tag);
    }
  },
);

/**
 * Fetch a single post by its slug
 */
export const fetchPostBySlug = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>("posts/fetchPostBySlug", async (slug, { rejectWithValue }) => {
  if (POSTS_FALLBACK_ONLY) {
    const post = getFallbackPostBySlug(slug);
    if (post) return post;
    return rejectWithValue("Post not found.");
  }
  try {
    const response = await axios.get(`${API_URL}/posts/${slug}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch {
    const post = getFallbackPostBySlug(slug);
    if (post) return post;
    return rejectWithValue("Post not found.");
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, handlePending)
      .addCase(fetchPosts.fulfilled, handleFulfilledPosts)
      .addCase(fetchPosts.rejected, handleRejected)
      .addCase(fetchPostsByTag.pending, handlePending)
      .addCase(fetchPostsByTag.fulfilled, handleFulfilledPosts)
      .addCase(fetchPostsByTag.rejected, handleRejected)
      .addCase(fetchPostBySlug.pending, handlePending)
      .addCase(fetchPostBySlug.fulfilled, handleFulfilledPost)
      .addCase(fetchPostBySlug.rejected, handleRejected);
  },
});

export const { setPosts, addPost } = postsSlice.actions;

export default postsSlice.reducer;
