import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/api";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchPosts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ postData, token }, { rejectWithValue }) => {
    try {
      const response = await api.createPost(postData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData, token }, { rejectWithValue }) => {
    try {
      const response = await api.updatePost(postId, postData, token);
      return { postId, updatedPost: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, token }, { rejectWithValue }) => {
    try {
      await api.deletePost(postId, token);
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, token }, { rejectWithValue, getState }) => {
    try {
      const response = await api.likePost(postId, token);
      return { postId, updatedPost: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async ({ postId, token }, { rejectWithValue }) => {
    try {
      const response = await api.unlikePost(postId, token);
      return { postId, updatedPost: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({ postId, commentData, token }, { rejectWithValue }) => {
    try {
      // Gabungkan postId ke dalam commentData
      const response = await api.createComment(
        { postId, ...commentData },
        token
      );
      return { postId, comment: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 1,
  postsPerPage: 5,
  showPostForm: false,
  editingPost: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPostsPerPage: (state, action) => {
      state.postsPerPage = action.payload;
      state.currentPage = 1;
    },
    showPostForm: (state) => {
      state.showPostForm = true;
    },
    hidePostForm: (state) => {
      state.showPostForm = false;
      state.editingPost = null;
    },
    setEditingPost: (state, action) => {
      state.editingPost = action.payload;
      state.showPostForm = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add to beginning
        state.showPostForm = false;
        state.currentPage = 1; // Reset to first page
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex((post) => post._id === postId);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.showPostForm = false;
        state.editingPost = null;
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comment } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
        }
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex((post) => post._id === postId);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.error = null;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unlike Post
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex((post) => post._id === postId);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.error = null;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setPostsPerPage,
  showPostForm,
  hidePostForm,
  setEditingPost,
  clearError,
} = postsSlice.actions;

export const selectAllPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectCurrentPage = (state) => state.posts.currentPage;
export const selectPostsPerPage = (state) => state.posts.postsPerPage;
export const selectShowPostForm = (state) => state.posts.showPostForm;
export const selectEditingPost = (state) => state.posts.editingPost;

export const selectCurrentPosts = (state) => {
  const { posts, currentPage, postsPerPage } = state.posts;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  return posts.slice(indexOfFirstPost, indexOfLastPost);
};

export const selectTotalPages = (state) => {
  const { posts, postsPerPage } = state.posts;
  return Math.ceil(posts.length / postsPerPage);
};

export default postsSlice.reducer;
