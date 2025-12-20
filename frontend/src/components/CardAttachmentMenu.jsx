import { useState, useRef } from "react";
import { PopoverMenu } from "./ui/PopoverMenu";
import { attachmentService } from "../services/attachment-service";
import { isValidURL } from "../services/util-service";
import { addCardAttachment } from "../store/actions/board-actions";

export function CardAttachmentsMenu({ card, anchorEl, isOpen, onClose }) {
  const [isSaving, setIsSaving] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  async function handleUploadAttachment(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      setError("");

      const uploaded = await attachmentService.uploadImage(file, "attachments");

      addCardAttachment(card._id, {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        name: uploaded.original_filename || file.name,
      });
    } catch (err) {
      setError(err?.message || "Upload failed");
    } finally {
      setIsSaving(false);
      ev.target.value = "";
    }
  }

  async function handleAddUrlAttachment() {
    const url = attachmentUrl.trim();
    if (!url) return;
    if (!isValidURL(url)) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      addCardAttachment(card._id, { url });
      setAttachmentUrl("");
    } catch (err) {
      setError(err?.message || "Failed to add attachment");
    } finally {
      setIsSaving(false);
    }
  }

  if (!card) return null;

  return (
    <PopoverMenu
      anchorEl={anchorEl}
      isOpen={isOpen}
      onClose={onClose}
      title="Attachments"
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
          <label className="cover-section-label">Upload image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadAttachment}
            style={{ display: "none" }}
          />
          <button
            className="remove-cover-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
          >
            {isSaving ? "Uploading..." : "Choose a file"}
          </button>
        </div>

        <div className="cover-section">
          <label className="cover-section-label">Add image URL</label>
          <div className="attachment-url-row">
            <input
              className="attachment-url-input"
              type="text"
              placeholder="https://..."
              value={attachmentUrl}
              onChange={e => setAttachmentUrl(e.target.value)}
            />
            <button
              type="button"
              className="attachment-url-add"
              onClick={handleAddUrlAttachment}
              disabled={isSaving || !attachmentUrl.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {isSaving && <div style={{ marginTop: 6 }}>Saving...</div>}
        {error && (
          <div style={{ marginTop: 6, color: "crimson", fontSize: 12 }}>
            {error}
          </div>
        )}
      </div>
    </PopoverMenu>
  );
}
