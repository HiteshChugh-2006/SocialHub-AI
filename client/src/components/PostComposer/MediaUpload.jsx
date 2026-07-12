/**
 * client/src/components/PostComposer/MediaUpload.jsx
 * File upload with image/video preview and drag-and-drop.
 */

import { useState, useRef, useCallback } from 'react';
import styles from './MediaUpload.module.css';
import { PLATFORM_RULES } from '../../utils/platformRules';

// Max 10 files, 100 MB each
const MAX_FILES    = 10;
const MAX_SIZE_MB  = 100;
const MAX_SIZE     = MAX_SIZE_MB * 1024 * 1024;

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
];

const MediaUpload = ({ mediaFiles, onFilesChange, selectedPlatforms }) => {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  // Determine if any selected platform disallows video
  const videoDisallowedPlatforms = selectedPlatforms.filter(
    (p) => PLATFORM_RULES[p] && !PLATFORM_RULES[p].allowVideo
  );
  const showVideoWarning = videoDisallowedPlatforms.length > 0;

  // Validate and merge new files
  const processFiles = useCallback(
    (newFiles) => {
      setError('');
      const validFiles = [];

      for (const file of newFiles) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError(`"${file.name}" is not a supported file type.`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          setError(`"${file.name}" exceeds the ${MAX_SIZE_MB} MB limit.`);
          continue;
        }
        validFiles.push(file);
      }

      const merged = [...mediaFiles, ...validFiles].slice(0, MAX_FILES);
      onFilesChange(merged);
    },
    [mediaFiles, onFilesChange]
  );

  const handleInputChange = (e) => processFiles(Array.from(e.target.files || []));

  // Drag & drop handlers
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()  => setDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files || []));
  };

  const removeFile = (index) => {
    const updated = mediaFiles.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  // Build preview URLs
  const previews = mediaFiles.map((file) => ({
    url:  URL.createObjectURL(file),
    type: file.type.startsWith('video/') ? 'video' : 'image',
    name: file.name,
  }));

  return (
    <div className={styles.container}>
      <span className={styles.label}>Media</span>

      {/* LinkedIn video restriction notice */}
      {showVideoWarning && (
        <div className={styles.videoNotice} role="alert" aria-live="polite">
          ⚠️&nbsp; <strong>LinkedIn</strong> does not support video — video files will be
          ignored for that platform.
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`${styles.uploadZone} ${dragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload images or videos"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id="media-upload-input"
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className={styles.hiddenInput}
          onChange={handleInputChange}
          aria-label="Choose files to upload"
        />
        <div className={styles.uploadIcon} aria-hidden="true">📎</div>
        <p className={styles.uploadText}>
          <strong>Click to upload</strong> or drag & drop
        </p>
        <p className={styles.uploadMeta}>
          Images (JPEG, PNG, GIF, WebP) · Videos (MP4, MOV, AVI, WebM) · Max {MAX_SIZE_MB} MB each
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className={styles.uploadError} role="alert">
          ⚠️ {error}
        </p>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className={styles.previewGrid} aria-label="Uploaded media previews">
          {previews.map((preview, index) => (
            <div key={index} className={styles.previewItem}>
              <span className={styles.previewTypeBadge}>
                {preview.type === 'video' ? '▶ Video' : '🖼 Image'}
              </span>

              {preview.type === 'image' ? (
                <img
                  src={preview.url}
                  alt={`Preview of ${preview.name}`}
                  className={styles.previewImage}
                  onLoad={() => URL.revokeObjectURL(preview.url)}
                />
              ) : (
                <video
                  src={preview.url}
                  className={styles.previewVideo}
                  muted
                  playsInline
                  aria-label={`Video preview: ${preview.name}`}
                />
              )}

              <div className={styles.previewOverlay}>
                <span className={styles.previewFileName}>{preview.name}</span>
              </div>

              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeFile(index)}
                aria-label={`Remove ${preview.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
