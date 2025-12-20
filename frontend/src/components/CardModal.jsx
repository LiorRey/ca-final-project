import { useState, useRef } from "react";
import { Modal, Box, Button, TextareaAutosize } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import { LabelMenu } from "./LabelMenu";
import { TextEditor } from "./ui/TextEditor";
import { Avatar } from "./ui/Avatar";
import { AddMemberMenu } from "./AddMemberMenu";
import { AttachmentMenu } from "./AttachmentMenu";
import { addComment, deleteComment } from "../store/actions/board-actions";

export function CardModal({
  boardId,
  listId,
  listTitle,
  card,
  cardLabels = [],
  onEditCard,
  onClose,
  isOpen,
}) {
  const [openSection, setOpenSection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState(card);
  const [anchorEl, setAnchorEl] = useState(null);
  const [memberAnchorEl, setMemberAnchorEl] = useState(null);
  const [attachFileAnchorEl, setAttachFileAnchorEl] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const membersContainerRef = useRef(null);
  const isLabelMenuOpen = Boolean(anchorEl);
  const isMemberMenuOpen = Boolean(memberAnchorEl);
  const isAttachFileMenuOpen = Boolean(attachFileAnchorEl);

  function handleCommentSection() {
    setOpenSection(!openSection);
  }

  async function handleSaveComment() {
    if (!commentDraft || commentDraft === "<p></p>") return;

    await addComment(card._id, commentDraft);

    setCommentDraft("");
  }

  async function handleDeleteComment(commentId) {
    await deleteComment(card._id, commentId);
  }

  function handleSaveCard() {
    setIsEditorOpen(false);
    onEditCard(cardDetails);
    setIsEditing(false);
  }

  function handleCancelCard() {
    setIsEditorOpen(false);
    setIsEditing(false);
    setCardDetails(card);
  }

  function handleChangeCard(key, value) {
    setCardDetails({ ...cardDetails, [key]: value });
  }

  function handleAttachFile(element) {
    setAttachFileAnchorEl(element);
  }

  if (!card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={`card-modal-box ${openSection ? "open" : "closed"}`}>
        <div className="card-modal-header-container">
          <div
            className={`card-modal-cover ${
              card.cover?.color || card.cover?.img ? "cover" : ""
            }`}
            style={{
              backgroundColor: card.cover?.color,
              backgroundImage: card.cover?.img && `url(${card.cover.img})`,
            }}
          >
            <div className="card-modal-header">
              {listTitle}
              <div className="card-modal-header-buttons">
                <button className="icon-button">
                  <ImageOutlinedIcon />
                </button>
                <button className="icon-button">
                  <MoreHorizIcon />
                </button>
                <button className="icon-button" onClick={onClose}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-modal-container">
          <section className="card-modal-content">
            <div className="card-modal-title-container">
              {!isEditing ? (
                <h1
                  className="card-modal-title"
                  onClick={() => setIsEditing(true)}
                >
                  {cardDetails.title}
                </h1>
              ) : (
                <TextareaAutosize
                  className="card-modal-title-input"
                  value={cardDetails.title}
                  onChange={e => handleChangeCard("title", e.target.value)}
                  onBlur={() => {
                    setIsEditing(false);
                    onEditCard(cardDetails);
                  }}
                  autoFocus
                />
              )}
            </div>
            <div className="card-modal-controls">
              <button
                className="icon-button"
                onClick={e => setAnchorEl(e.currentTarget)}
                selected={isLabelMenuOpen}
              >
                <AddIcon /> Add
              </button>
              <button className="icon-button">
                <AccessTimeOutlinedIcon /> Dates
              </button>
              <button className="icon-button">
                <TaskAltOutlinedIcon /> Checklist
              </button>
              <button
                className="icon-button"
                onClick={e => setMemberAnchorEl(e.currentTarget)}
              >
                <PersonAddAltOutlinedIcon /> Members
              </button>
              <button
                className="icon-button"
                onClick={e => {
                  e.stopPropagation();
                  handleAttachFile(e.currentTarget);
                }}
              >
                <AttachFileIcon /> Attach
              </button>
            </div>
            <div className="card-modal-tags-container">
              {((card.assignees && card.assignees.length > 0) ||
                memberAnchorEl) && (
                <div className="card-modal-members">
                  <h3 className="members-title">Members</h3>
                  <div className="modal-members" ref={membersContainerRef}>
                    {card.assignees && card.assignees.length > 0 && (
                      <>
                        {card.assignees.map(assignee => (
                          <Avatar
                            key={assignee.userId}
                            user={assignee}
                            size={36}
                          />
                        ))}
                      </>
                    )}
                    <button
                      className="add-member-button"
                      onClick={() =>
                        setMemberAnchorEl(membersContainerRef.current)
                      }
                    >
                      <AddIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              )}
              {cardLabels && cardLabels.length > 0 && (
                <div className="card-modal-labels">
                  <h3 className="labels-title">Labels</h3>
                  <div className="modal-labels">
                    {cardLabels.map(label => (
                      <div
                        className={`modal-label ${label.color}`}
                        key={label._id}
                      >
                        {label.title}
                      </div>
                    ))}
                    <button className="add-label-button">+</button>
                  </div>
                </div>
              )}
            </div>
            <div className="card-modal-description">
              <NotesIcon fontSize="small" />
              <h3 className="description-title">Description</h3>
              {isEditorOpen ? (
                <>
                  <TextEditor
                    variant="description"
                    content={cardDetails.description}
                    placeholder={cardDetails.description}
                    onChange={html => handleChangeCard("description", html)}
                  />
                  <div className="editor-controls">
                    <Button onClick={handleSaveCard}>Save</Button>
                    <Button variant="outlined" onClick={handleCancelCard}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  className="description-content"
                  onClick={() => setIsEditorOpen(true)}
                  dangerouslySetInnerHTML={{
                    __html: cardDetails.description,
                  }}
                />
              )}
            </div>
          </section>
          <aside
            className={`card-modal-comments ${openSection ? "open" : "closed"}`}
          >
            <div className="card-modal-comments-content">
              <h3 className="comments-title">Comments</h3>
              <TextEditor
                variant="comment"
                content={commentDraft}
                placeholder="Write a comment..."
                onChange={setCommentDraft}
                // onChange={html => handleChangeCard("description", html)}
              />
              <div className="editor-controls">
                <Button onClick={handleSaveComment}>Save</Button>
              </div>
              <div className="comments-list">
                {(card.comments || [])
                  .slice()
                  .reverse()
                  .map(comment => (
                    <div key={comment._id} className="comment-item">
                      <Avatar user={comment.author} size={32} />

                      <div className="comment-body">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.author.fullname}
                          </span>
                          {/* <span className="comment-text">{comment.text}</span> */}
                          {/* <span className="comment-time">
                            {new Date(comment.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span> */}
                        </div>

                        <div
                          className="comment-text"
                          dangerouslySetInnerHTML={{ __html: comment.text }}
                        />

                        <div className="comment-actions">
                          <span>Edit</span>
                          <span
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
        <footer className="card-modal-footer">
          <button
            className={`comment-section-button ${openSection ? "active" : ""}`}
            onClick={handleCommentSection}
          >
            Comments
          </button>
        </footer>

        <AttachmentMenu
          card={card}
          anchorEl={attachFileAnchorEl}
          isAttachFileMenuOpen={isAttachFileMenuOpen}
          onCloseAttachFileMenu={() => setAttachFileAnchorEl(null)}
        />

        <AddMemberMenu
          card={card}
          anchorEl={memberAnchorEl}
          isMemberMenuOpen={isMemberMenuOpen}
          onCloseMemberMenu={() => setMemberAnchorEl(null)}
        />

        <LabelMenu
          boardId={boardId}
          listId={listId}
          card={card}
          anchorEl={anchorEl}
          isLabelMenuOpen={isLabelMenuOpen}
          onCloseLabelMenu={() => setAnchorEl(null)}
        />
      </Box>
    </Modal>
  );
}
