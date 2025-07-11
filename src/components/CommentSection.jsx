import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegComment, FaPaperPlane } from "react-icons/fa";
import { createComment } from "../store/slices/postsSlice";
import api from "../api/api";

const CommentSection = ({ postId, comments = [] }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch comments untuk post tertentu
  const fetchComments = async () => {
    try {
      const data = await api.fetchCommentsForPost(postId);
      setLocalComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Load comments saat komponen dimuat
  useEffect(() => {
    // Selalu fetch comments untuk mendapatkan jumlah komentar
    fetchComments();
  }, [postId]);

  // Handle submit komentar baru
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setLoading(true);
    try {
      await dispatch(
        createComment({
          postId,
          commentData: { text: newComment }, // hanya text saja
          token,
        })
      ).unwrap();
      setNewComment("");
      fetchComments();
    } catch (error) {
      // Tampilkan pesan error asli jika ada
      console.error("Error creating comment:", error);
      alert(error?.message || "Gagal menambahkan komentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Toggle button untuk menampilkan/menyembunyikan komentar */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
      >
        <FaRegComment className="w-4 h-4" />
        <span className="text-sm">
          {showComments ? "Hidden" : "Show"}{" "}
          {initialLoading ? "..." : localComments.length} comments
        </span>
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Form untuk menambah komentar */}
          {token && (
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Daftar komentar */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {localComments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Be the first to comment!
              </p>
            ) : (
              localComments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">
                      {comment.author?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.author?.username || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
