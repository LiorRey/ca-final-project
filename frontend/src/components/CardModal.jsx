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
  const membersContainerRef = useRef(null);
  const isLabelMenuOpen = Boolean(anchorEl);
  const isMemberMenuOpen = Boolean(memberAnchorEl);
  const isAttachFileMenuOpen = Boolean(attachFileAnchorEl);

  function handleCommentSection() {
    setOpenSection(!openSection);
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
              backgroundColor:
                card.cover?.img && card.cover?.color
                  ? undefined
                  : card.cover?.color,
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
                    content={cardDetails.description}
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
              <textarea
                className="comment-input"
                placeholder="Add a comment"
                spellCheck="false"
              />
              <button className="add-comment-button">Add</button>
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
