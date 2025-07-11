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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RateMyPets</h1>
          <p className="text-gray-600">
            Share your pet stories and rate other pets!
          </p>
        </div>

        {/* Tombol Create Post */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => dispatch(showPostForm())}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow"
          >
            <MdAddCircle className="mr-2 w-6 h-6" />
            Create Post
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {currentPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <img
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="User"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {post.author?.username || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getTimeAgo(new Date(post.createdAt))}
                  </p>
                </div>
                {canEditDeletePost(post) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 mb-3">{post.content}</p>
                {/* Tampilkan gambar jika ada */}
                {(post.imageUrl || post.image) && (
                  <img
                    src={post.imageUrl || post.image}
                    alt="Post"
                    className="w-full rounded-lg mt-2"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                  >
                    {post.likedBy && post.likedBy.includes(user?.userId) ? (
                      <FaHeart className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-5 w-5" />
                    )}
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    <FaRegComment className="h-5 w-5" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection postId={post._id} comments={post.comments} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNumber === "number" && paginate(pageNumber)
                }
                disabled={pageNumber === "..."}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  pageNumber === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : pageNumber === "..."
                    ? "bg-white text-gray-400 border-gray-300 cursor-default"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
