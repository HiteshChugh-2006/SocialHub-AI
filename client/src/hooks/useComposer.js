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

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/configuration';
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
  // Initialize from local storage if available
  const getInitialDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFT_POST);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse draft from local storage', e);
    }
    return { content: '', selectedPlatforms: [], scheduledDate: '' };
  };

  const initialDraft = getInitialDraft();

  const [content, setContent]                   = useState(initialDraft.content);
  const [selectedPlatforms, setSelectedPlatforms] = useState(initialDraft.selectedPlatforms);
  const [scheduledDate, setScheduledDate]       = useState(initialDraft.scheduledDate);
  const [image, setImage]                       = useState(null); // { file, preview, name, size }
  const [video, setVideo]                       = useState(null); // { file, name, size }
  const [isSubmitting, setIsSubmitting]         = useState(false);

  const textareaRef = useRef(null);

  // ── Auto-save to Local Storage ──────────────────────────────────────────────
  useEffect(() => {
    const draft = {
      content,
      selectedPlatforms,
      scheduledDate,
    };
    localStorage.setItem(STORAGE_KEYS.DRAFT_POST, JSON.stringify(draft));
  }, [content, selectedPlatforms, scheduledDate]);

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
    () => {
      const isPast = scheduledDate ? new Date(scheduledDate) < new Date() : false;
      return (
        selectedPlatforms.length > 0 &&
        content.trim().length > 0 &&
        isAllValid(validationResults) &&
        !isPast
      );
    },
    [selectedPlatforms, content, validationResults, scheduledDate]
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

  // ─── Clear form & Delete Draft ─────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setContent('');
    setSelectedPlatforms([]);
    setScheduledDate('');
    setImage(null);
    setVideo(null);
    localStorage.removeItem(STORAGE_KEYS.DRAFT_POST);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    addToast('Draft deleted from local storage.', 'info');
  }, [addToast]);

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
      if (scheduledDate) {
        // Teacher requirement: save scheduled posts to local storage mapping
        const scheduledListRaw = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
        const scheduledList = scheduledListRaw ? JSON.parse(scheduledListRaw) : [];
        
        const newScheduledPost = {
          id: Date.now().toString(),
          content,
          selectedPlatforms,
          scheduledDate,
          createdAt: new Date().toISOString()
        };
        
        scheduledList.push(newScheduledPost);
        localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(scheduledList));
        
        addToast('📅 Post successfully scheduled locally!', 'success');
        handleClear();
      } else {
        // Normal immediate publish via API
        const formData = new FormData();
        formData.append('content', content);
        selectedPlatforms.forEach((p) => formData.append('selectedPlatforms[]', p));
        if (image?.file) formData.append('image', image.file);
        if (video?.file) formData.append('video', video.file);

        await createPost(formData);
        addToast('🎉 Post published immediately!', 'success');
        handleClear();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [canPublish, isSubmitting, content, selectedPlatforms, image, video, scheduledDate, addToast, handleClear]);

  // ─── Return API ────────────────────────────────────────────────────────────
  return {
    // State
    content,
    selectedPlatforms,
    scheduledDate,
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
    setScheduledDate,
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
