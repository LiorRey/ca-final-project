import AttachFileIcon from "@mui/icons-material/AttachFile";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { removeCardAttachment } from "../store/actions/board-actions";
import { attachmentService } from "../services/attachment-service";

function formatUploadedAt(dateInput) {
  const date = dateInput ? new Date(dateInput) : null;
  if (!date || Number.isNaN(date.getTime())) return "Added";
  return `Added ${date.toLocaleString()}`;
}

export function CardAttachments({ card, onOpenAttachmentsMenu }) {
  function handleRemoveAttachment(attachmentId) {
    if (!attachmentId) return;
    removeCardAttachment(card._id, attachmentId);
  }

  return (
    <div className="card-modal-attachments">
      <AttachFileIcon fontSize="small" />

      <div className="attachments-header">
        <h3 className="attachments-title">Attachments</h3>
        <button
          type="button"
          className="edit-description-button"
          onClick={e => {
            e.stopPropagation();
            onOpenAttachmentsMenu?.(e.currentTarget);
          }}
        >
          Add
        </button>
      </div>

      <div className="attachments-content">
        <div className="attachments-subtitle">Files</div>

        {card.attachments && card.attachments.length > 0 ? (
          <div className="attachments-list">
            {card.attachments.map(att => {
              const key = att._id || att.url;
              return (
                <div className="attachment-row" key={key}>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="attachment-thumb"
                    title={att.name || "Open attachment"}
                  >
                    <img
                      src={
                        att.publicId
                          ? attachmentService.getThumbnailUrl(att.publicId)
                          : att.url
                      }
                      alt={att.name || "attachment"}
                      loading="lazy"
                    />
                  </a>

                  <div className="attachment-info">
                    <a
                      className="attachment-name"
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      title={att.name || att.url}
                    >
                      {att.name || att.url}
                    </a>
                    <div className="attachment-subline">
                      {formatUploadedAt(att.createdAt)}
                    </div>
                  </div>

                  <div className="attachment-actions">
                    <IconButton
                      className="attachment-action-btn"
                      component="a"
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open attachment in new tab"
                      onClick={e => e.stopPropagation()}
                      size="small"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      className="attachment-action-btn attachment-remove-btn"
                      aria-label="Remove attachment"
                      title="Remove"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveAttachment(att._id);
                      }}
                      disabled={!att._id}
                      size="small"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="attachments-empty">No attachments yet</div>
        )}
      </div>
    </div>
  );
}
