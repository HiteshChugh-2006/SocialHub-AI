/**
 * useComposer.js — Custom hook encapsulating all Post Composer state and logic
 *
 * Responsibilities:
 *   - Post content state
 *   - Selected platform management
 *   - Media upload handling (image + video)
 *   - Real-time validation (character count, hashtag count, platform rules)
 *   - Form actions: submit, clear, copy
 *
 * This hook is the single source of truth for the ComposerPage.
 * Future experiments can extend it with scheduling, AI suggestions, drafts, etc.
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import { createPost } from '../services/api';
import {
  countHashtags,
  validateAllPlatforms,
  isAllValid,
  isValidImageFile,
  isValidVideoFile,
  formatFileSize,
} from '../utils/validators';
import { useApp } from '../context/AppContext';

// ─── Max file sizes ───────────────────────────────────────────────────────────
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50 MB

const useComposer = () => {
  const { addToast } = useApp();

  // ── Core state ──────────────────────────────────────────────────────────────
  const [content, setContent]                   = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [image, setImage]                       = useState(null); // { file, preview, name, size }
  const [video, setVideo]                       = useState(null); // { file, name, size }
  const [isSubmitting, setIsSubmitting]         = useState(false);

  const textareaRef = useRef(null);

  // ── Derived: character & hashtag counts ────────────────────────────────────
  const charCount    = content.length;
  const hashtagCount = useMemo(() => countHashtags(content), [content]);

  // ── Derived: real-time validation results ──────────────────────────────────
  const validationResults = useMemo(
    () =>
      validateAllPlatforms(selectedPlatforms, {
        content,
        hasImage: !!image,
        hasVideo: !!video,
      }),
    [content, selectedPlatforms, image, video]
  );

  // ── Derived: is publish button enabled ─────────────────────────────────────
  const canPublish = useMemo(
    () =>
      selectedPlatforms.length > 0 &&
      content.trim().length > 0 &&
      isAllValid(validationResults),
    [selectedPlatforms, content, validationResults]
  );

  // ─── Content handler ───────────────────────────────────────────────────────
  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);

    // Auto-resize textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // ─── Platform toggle ───────────────────────────────────────────────────────
  const togglePlatform = useCallback((platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  }, []);

  // ─── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = useCallback(
    (file) => {
      if (!isValidImageFile(file)) {
        addToast('Unsupported image format. Use JPEG, PNG, GIF, or WebP.', 'error');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        addToast(`Image too large (max ${formatFileSize(MAX_IMAGE_SIZE)})`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    },
    [addToast]
  );

  // ─── Video upload ──────────────────────────────────────────────────────────
  const handleVideoUpload = useCallback(
    (file) => {
      if (!isValidVideoFile(file)) {
        addToast('Unsupported video format. Use MP4, MOV, or WebM.', 'error');
        return;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        addToast(`Video too large (max ${formatFileSize(MAX_VIDEO_SIZE)})`, 'error');
        return;
      }
      setVideo({ file, name: file.name, size: file.size });
    },
    [addToast]
  );

  // ─── Remove media ──────────────────────────────────────────────────────────
  const removeImage = useCallback(() => setImage(null), []);
  const removeVideo = useCallback(() => setVideo(null), []);

  // ─── Clear form ────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setContent('');
    setSelectedPlatforms([]);
    setImage(null);
    setVideo(null);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  // ─── Copy text ─────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!content.trim()) {
      addToast('Nothing to copy yet.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      addToast('Post text copied to clipboard!', 'success');
    } catch {
      addToast('Failed to copy text. Please copy manually.', 'error');
    }
  }, [content, addToast]);

  // ─── Submit / Publish ──────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!canPublish || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      selectedPlatforms.forEach((p) => formData.append('selectedPlatforms[]', p));
      if (image?.file) formData.append('image', image.file);
      if (video?.file) formData.append('video', video.file);

      await createPost(formData);
      addToast('🎉 Post saved successfully!', 'success');
      handleClear();
    } catch (err) {
      addToast(err.message || 'Failed to save post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [canPublish, isSubmitting, content, selectedPlatforms, image, video, addToast, handleClear]);

  // ─── Return API ────────────────────────────────────────────────────────────
  return {
    // State
    content,
    selectedPlatforms,
    image,
    video,
    isSubmitting,

    // Derived
    charCount,
    hashtagCount,
    validationResults,
    canPublish,

    // Refs
    textareaRef,

    // Actions
    handleContentChange,
    togglePlatform,
    handleImageUpload,
    handleVideoUpload,
    removeImage,
    removeVideo,
    handleClear,
    handleCopy,
    handleSubmit,
  };
};

export default useComposer;
