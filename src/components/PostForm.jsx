import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaImage, FaTimes, FaSpinner } from "react-icons/fa";
import {
  createPost,
  updatePost,
  hidePostForm,
  selectEditingPost,
} from "../store/slices/postsSlice";
import { fetchPosts } from "../store/slices/postsSlice";
import api from "../api/api";

const PostForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const editingPost = useSelector(selectEditingPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    petName: "",
    category: "",
    caption: "",
    imageUrl: "",
  });

  // Check if this is edit mode or create mode
  const isEditMode = !!editingPost;

  const categories = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Rabbit",
    "Hamster",
    "Guinea Pig",
    "Turtle",
    "Snake",
    "Other",
  ];

  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode && editingPost) {
      setFormData({
        petName: editingPost.petName || "",
        category: editingPost.category || "",
        caption: editingPost.caption || "",
        imageUrl: editingPost.imageUrl || "",
      });
      setImagePreview(editingPost.imageUrl || null);
    }
  }, [isEditMode, editingPost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));

    // Set preview if URL is valid
    if (url && isValidImageUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const isValidImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
  };

  // Check if user can edit this post (for edit mode)
  const canEditPost = () => {
    if (!isEditMode || !user || !editingPost) return true; // For create mode, always true

    // Admin can edit all posts
    if (user.role === "admin") return true;

    // Regular user can only edit their own posts
    const postAuthorId = editingPost.author?._id || editingPost.author;
    return user.userId === postAuthorId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError(
        `Please login first to ${isEditMode ? "edit" : "create"} a post`
      );
      return;
    }

    if (isEditMode && !canEditPost()) {
      setError("You don't have permission to edit this post");
      return;
    }

    // Form validation
    if (!formData.petName.trim()) {
      setError("Pet name is required");
      return;
    }

    if (!formData.category) {
      setError("Category must be selected");
      return;
    }

    if (!formData.imageUrl.trim()) {
      setError("Image URL is required");
      return;
    }

    if (!isValidImageUrl(formData.imageUrl)) {
      setError("Invalid image URL. Use format: .jpg, .jpeg, .png, .gif, .webp");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        // Update post
        await dispatch(
          updatePost({
            postId: editingPost._id,
            postData: formData,
            token,
          })
        ).unwrap();
      } else {
        // Create new post
        await dispatch(createPost({ postData: formData, token })).unwrap();
        // Reset form
        setFormData({
          petName: "",
          category: "",
          caption: "",
          imageUrl: "",
        });
        setImagePreview(null);
      }

      // Close modal/form
      dispatch(hidePostForm());
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setError(
        error.message || `Failed to ${isEditMode ? "update" : "create"} post`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(hidePostForm());
    if (onClose) {
      onClose();
    }
  };

  // If edit mode and user cannot edit this post
  if (isEditMode && !canEditPost()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to edit this post.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pet Name *
            </label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your pet's name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL *
            </label>
            <div className="relative">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/pet-image.jpg"
                required
              />
              <FaImage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Preview
              </label>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Invalid+Image+URL";
                  }}
                />
              </div>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about your pet..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
