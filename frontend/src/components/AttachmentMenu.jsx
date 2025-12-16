import { PopoverMenu } from "./ui/PopoverMenu";
import { upsertCardCover } from "../store/actions/board-actions";
import { COVER_COLORS } from "../services/board/board-backgrounds";

export function AttachmentMenu({
  card,
  anchorEl,
  isAttachFileMenuOpen,
  onCloseAttachFileMenu,
}) {
  const textOverlay = card.cover?.textOverlay;
  const coverColor = card.cover?.color;

  function handleCloseMenu() {
    onCloseAttachFileMenu();
  }

  function handleTextOverlay(overlay) {
    upsertCardCover(card._id, {
      color: coverColor,
      textOverlay: overlay,
    });
  }

  function handleColorSelect(color) {
    upsertCardCover(card._id, { color: color.value, textOverlay });
  }

  function handleRemoveCover() {
    upsertCardCover(card._id, { color: null, textOverlay: false });
  }

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
        {coverColor && (
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
                style={{ backgroundColor: coverColor }}
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
                style={{ backgroundColor: coverColor }}
                onClick={() => handleTextOverlay(true)}
              >
                <CoverPreviewSkeleton className="cover-preview-container-transparent" />
              </button>
            </div>
          </div>
        )}

        {coverColor && (
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
