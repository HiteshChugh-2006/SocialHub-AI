/**
 * MediaUpload.jsx — Image and video upload component
 *
 * Features:
 *   - Drag-and-drop + file picker
 *   - Image preview
 *   - Video filename preview
 *   - Remove button
 *   - Accepts images and videos separately
 */

import { useRef, useState } from 'react';
import { formatFileSize } from '../../utils/validators';
import './MediaUpload.css';

/**
 * @param {object}   image             - { file, preview, name, size } | null
 * @param {object}   video             - { file, name, size } | null
 * @param {Function} onImageUpload     - (File) => void
 * @param {Function} onVideoUpload     - (File) => void
 * @param {Function} onRemoveImage     - () => void
 * @param {Function} onRemoveVideo     - () => void
 */
const MediaUpload = ({ image, video, onImageUpload, onVideoUpload, onRemoveImage, onRemoveVideo }) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) onImageUpload(file);
    else if (file.type.startsWith('video/')) onVideoUpload(file);
  };

  // ── File input handlers ────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(file);
    e.target.value = ''; // Reset so same file can be re-selected
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) onVideoUpload(file);
    e.target.value = '';
  };

  const hasMedia = image || video;

  return (
    <div className="media-upload">
      {/* ── Drop Zone (shown when no media) ───────────────────────────── */}
      {!hasMedia && (
        <div
          className={`media-upload__dropzone ${isDragging ? 'media-upload__dropzone--dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Drop media here or click to upload"
        >
          <div className="media-upload__dropzone-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 34l10-10 8 8 6-6 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 12h12M36 6v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="media-upload__dropzone-text">
            Drag &amp; drop an image or video here
          </p>
          <p className="media-upload__dropzone-sub">or choose below</p>
        </div>
      )}

      {/* ── Media Buttons ──────────────────────────────────────────────── */}
      {!hasMedia && (
        <div className="media-upload__buttons">
          <button
            id="upload-image-btn"
            type="button"
            className="media-upload__btn media-upload__btn--image"
            onClick={() => imageInputRef.current?.click()}
            aria-label="Upload image"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 14l4-4 3 3 3-3 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Upload Image
          </button>
          <button
            id="upload-video-btn"
            type="button"
            className="media-upload__btn media-upload__btn--video"
            onClick={() => videoInputRef.current?.click()}
            aria-label="Upload video"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 8l4-2v8l-4-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Upload Video
          </button>
        </div>
      )}

      {/* ── Hidden file inputs ─────────────────────────────────────────── */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="media-upload__input"
        onChange={handleImageChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="media-upload__input"
        onChange={handleVideoChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ── Image Preview ──────────────────────────────────────────────── */}
      {image && (
        <div className="media-upload__preview media-upload__preview--image">
          <img
            src={image.preview}
            alt={`Preview: ${image.name}`}
            className="media-upload__image"
          />
          <div className="media-upload__preview-meta">
            <span className="media-upload__preview-name" title={image.name}>{image.name}</span>
            <span className="media-upload__preview-size">{formatFileSize(image.size)}</span>
          </div>
          <button
            id="remove-image-btn"
            type="button"
            className="media-upload__remove"
            onClick={onRemoveImage}
            aria-label="Remove image"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Video Preview ──────────────────────────────────────────────── */}
      {video && (
        <div className="media-upload__preview media-upload__preview--video">
          <div className="media-upload__video-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 9l6-3v12l-6-3V9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="media-upload__preview-meta">
            <span className="media-upload__preview-name" title={video.name}>{video.name}</span>
            <span className="media-upload__preview-size">{formatFileSize(video.size)}</span>
          </div>
          <button
            id="remove-video-btn"
            type="button"
            className="media-upload__remove"
            onClick={onRemoveVideo}
            aria-label="Remove video"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
