import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaRegThumbsUp,
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import {
  fetchPosts,
  likePost,
  unlikePost,
  deletePost,
  setCurrentPage,
  setEditingPost,
  selectAllPosts,
  selectPostsLoading,
  selectPostsError,
  selectCurrentPage,
  selectPostsPerPage,
  selectCurrentPosts,
  selectTotalPages,
  showPostForm,
} from "../store/slices/postsSlice";
import { getTimeAgo } from "../utils/timeUtils";
import CommentSection from "./CommentSection";
import PostForm from "./PostForm";

const Feed = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const currentPage = useSelector(selectCurrentPage);
  const postsPerPage = useSelector(selectPostsPerPage);
  const currentPosts = useSelector(selectCurrentPosts);
  const totalPages = useSelector(selectTotalPages);

  // Fetch posts when component mounts
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Handle like/unlike post
  const handleLike = async (post) => {
    if (!token) {
      alert("Silakan login terlebih dahulu untuk like post");
      return;
    }

    try {
      const isLiked = post.likedBy && post.likedBy.includes(user.userId);

      if (isLiked) {
        await dispatch(unlikePost({ postId: post._id, token })).unwrap();
      } else {
        await dispatch(likePost({ postId: post._id, token })).unwrap();
      }
    } catch (error) {
      console.error("Error handling like:", error);
      alert("Gagal melakukan like/unlike post");
    }
  };

  // Check if user can edit/delete post
  const canEditDeletePost = (post) => {
    if (!user || !post) return false;

    // Admin can edit/delete all posts
    if (user.role === "admin") return true;

    // Regular user can only edit/delete their own posts
    const postAuthorId = post.author?._id || post.author;
    return user.userId === postAuthorId;
  };

  // Handle delete post
  const handleDeletePost = async (post) => {
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menghapus post");
      return;
    }

    if (!canEditDeletePost(post)) {
      alert("Anda tidak memiliki izin untuk menghapus post ini");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus post ini?")) {
      try {
        await dispatch(deletePost({ postId: post._id, token })).unwrap();
        alert("Post berhasil dihapus");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Gagal menghapus post");
      }
    }
  };

  // Handle edit post
  const handleEditPost = (post) => {
    dispatch(setEditingPost(post));
  };

  // Change page
  const paginate = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page + ellipsis + current page + ellipsis + last page
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              RateMyPets
            </h1>
            <p className="text-gray-600 text-lg">
              Share your pet stories and connect with fellow pet lovers!
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => dispatch(showPostForm())}
            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl"></div>
            <div className="relative flex items-center space-x-2">
              <MdAddCircle className="w-5 h-5" />
              <span>Create Post</span>
            </div>
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {currentPosts.map((post) => (
            <div key={post._id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="User"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {post.author?.username || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getTimeAgo(new Date(post.createdAt))}
                      </p>
                    </div>
                  </div>
                  {canEditDeletePost(post) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                {/* Pet Name */}
                {post.petName && (
                  <h5 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.petName}
                  </h5>
                )}

                {/* Caption */}
                {post.caption && (
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                    {post.caption}
                  </p>
                )}

                {/* Pet Image */}
                {(post.imageUrl || post.image) && (
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={post.imageUrl || post.image}
                      alt="Pet"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post)}
                      className="group flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      {post.likedBy && post.likedBy.includes(user?.userId) ? (
                        <FaHeart className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                      ) : (
                        <FaRegHeart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      )}
                      <span className="font-medium">{post.likes || 0}</span>
                    </button>
                    <button className="group flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                      <FaRegComment className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-100">
                <CommentSection postId={post._id} comments={post.comments} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-12">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex space-x-2">
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof pageNumber === "number" && paginate(pageNumber)
                  }
                  disabled={pageNumber === "..."}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    pageNumber === currentPage
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : pageNumber === "..."
                      ? "bg-transparent text-gray-400 cursor-default"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 border border-white/20 hover:bg-white hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;