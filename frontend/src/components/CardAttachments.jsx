import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { removeCardAttachment } from "../store/actions/board-actions";
import { attachmentService } from "../services/attachment-service";

export function CardAttachments({ card }) {
  function handleRemoveAttachment(attachmentId) {
    if (!attachmentId) return;
    removeCardAttachment(card._id, attachmentId);
  }

  return (
    <div className="card-modal-attachments">
      <AttachFileIcon fontSize="small" />
      <h3 className="attachments-title">Attachments</h3>

      <div className="attachments-content">
        {card.attachments && card.attachments.length > 0 ? (
          <div className="attachments-grid">
            {card.attachments.map(att => (
              <div className="attachment-item" key={att._id || att.url}>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="attachment-thumb"
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
                <div className="attachment-meta">
                  <span className="attachment-name">{att.name || "Image"}</span>
                  <button
                    type="button"
                    className="attachment-remove"
                    onClick={() => handleRemoveAttachment(att._id)}
                    disabled={!att._id}
                    aria-label="Remove attachment"
                    title="Remove"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="attachments-empty">No attachments yet</div>
        )}
      </div>
    </div>
  );
}
