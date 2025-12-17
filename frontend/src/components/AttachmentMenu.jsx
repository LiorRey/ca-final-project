import { useState } from "react";
import { PopoverMenu } from "./ui/PopoverMenu";
import { updateCardCover } from "../store/actions/board-actions";
import { COVER_COLORS } from "../services/board/board-backgrounds";
import { attachmentService } from "../services/attachment-service";

export function AttachmentMenu({
  card,
  anchorEl,
  isAttachFileMenuOpen,
  onCloseAttachFileMenu,
}) {
  const textOverlay = card.cover?.textOverlay;
  const coverColor = card.cover?.color;
  const coverImg = card.cover?.img;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function handleCloseMenu() {
    onCloseAttachFileMenu();
  }

  function handleTextOverlay(overlay) {
    updateCardCover(card._id, {
      color: coverColor,
      img: coverImg,
      textOverlay: overlay,
    });
  }

  function handleColorSelect(color) {
    updateCardCover(card._id, { color: color.value, textOverlay, img: null });
  }

  function handleRemoveCover() {
    updateCardCover(card._id, { color: null, textOverlay: false, img: null });
  }

  async function handleUploadCover(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError("");

      const uploaded = await attachmentService.uploadImage(file, "card-covers");

      updateCardCover(card._id, {
        img: uploaded.secure_url,
        color: null,
        textOverlay: textOverlay,
      });
    } catch (err) {
      setUploadError(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      ev.target.value = "";
    }
  }

  const coverStyle = coverImg
    ? { backgroundImage: `url(${coverImg})` }
    : coverColor
    ? { backgroundColor: coverColor }
    : undefined;

  return (
    <PopoverMenu
      anchorEl={anchorEl}
      isOpen={isAttachFileMenuOpen}
      onClose={handleCloseMenu}
      title="Cover"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <div className="attachment-menu-content">
        <div className="cover-section">
          <label className="cover-section-label">Upload</label>
          <input type="file" accept="image/*" onChange={handleUploadCover} />
          {isUploading && <div style={{ marginTop: 6 }}>Uploading...</div>}
          {uploadError && (
            <div style={{ marginTop: 6, color: "crimson", fontSize: 12 }}>
              {uploadError}
            </div>
          )}
        </div>

        {(coverColor || coverImg) && (
          <div className="cover-section">
            <label className="cover-section-label">Style</label>
            <div className="cover-size-options">
              <button
                type="button"
                role="radio"
                aria-checked={textOverlay === false}
                aria-label="Title under cover"
                className={`cover-size-preview ${
                  textOverlay === false ? "selected" : ""
                }`}
                style={coverStyle}
                onClick={() => handleTextOverlay(false)}
              >
                <CoverPreviewSkeleton className="cover-preview-container" />
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={textOverlay === true}
                aria-label="Title on cover"
                className={`cover-size-preview ${
                  textOverlay === true ? "selected" : ""
                }`}
                style={coverStyle}
                onClick={() => handleTextOverlay(true)}
              >
                <CoverPreviewSkeleton className="cover-preview-container-transparent" />
              </button>
            </div>
          </div>
        )}

        {(coverColor || coverImg) && (
          <button className="remove-cover-button" onClick={handleRemoveCover}>
            Remove cover
          </button>
        )}

        <div className="cover-section">
          <label className="cover-section-label">Colors</label>
          <div className="cover-colors-grid">
            {COVER_COLORS.map(color => (
              <button
                key={color.name}
                className={`cover-color-swatch ${
                  coverColor === color.value ? "selected" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </PopoverMenu>
  );
}

function CoverPreviewSkeleton({ className }) {
  return (
    <div className={className}>
      <div className="cover-preview-image"></div>
      <div className="cover-preview-spacer"></div>
      <div className="cover-preview-lines">
        <div className="cover-preview-line"></div>
        <div className="cover-preview-line"></div>
        <div className="cover-preview-line"></div>
      </div>
    </div>
  );
}
