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
import { CardCoverMenu } from "./CardCoverMenu";
import { CardAttachments } from "./CardAttachments";
import { CardAttachmentsMenu } from "./CardAttachmentMenu";
import { useSelector } from "react-redux";

export function CardModal({ listTitle, card, onEditCard, onClose, isOpen }) {
  const board = useSelector(state => state.boards.board);
  const [openSection, setOpenSection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState(card);
  const [labelEl, setLabelEl] = useState(null);
  const [memberEl, setMemberEl] = useState(null);
  const [coverEl, setCoverEl] = useState(null);
  const [attachmentsEl, setAttachmentsEl] = useState(null);
  const membersContainerRef = useRef(null);
  const isLabelMenuOpen = Boolean(labelEl);
  const isMemberMenuOpen = Boolean(memberEl);
  const isCoverMenuOpen = Boolean(coverEl);
  const isAttachmentsMenuOpen = Boolean(attachmentsEl);

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

  function handleOpenCoverMenu(element) {
    setCoverEl(element);
  }

  function handleOpenAttachmentsMenu(element) {
    setAttachmentsEl(element);
  }

  const cardLabels =
    board.labels && card.labelIds && card.labelIds.length > 0
      ? card.labelIds
          .map(labelId => board.labels.find(l => l._id === labelId))
          .filter(Boolean)
      : [];

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
              <div className="card-modal-header-list-title">{listTitle}</div>
              <div className="card-modal-header-buttons">
                <button
                  className="icon-button  modal-header-buttons"
                  onClick={e => handleOpenCoverMenu(e.currentTarget)}
                >
                  <ImageOutlinedIcon />
                </button>
                <button className="icon-button modal-header-buttons">
                  <MoreHorizIcon />
                </button>
                <button
                  className="icon-button modal-header-buttons"
                  onClick={onClose}
                >
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
                onClick={e => setLabelEl(e.currentTarget)}
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
                onClick={e => setMemberEl(e.currentTarget)}
              >
                <PersonAddAltOutlinedIcon /> Members
              </button>
              <button
                className="icon-button"
                onClick={e => {
                  e.stopPropagation();
                  handleOpenAttachmentsMenu(e.currentTarget);
                }}
              >
                <AttachFileIcon /> Attach
              </button>
            </div>
            <div className="card-modal-tags-container">
              {((card.assignees && card.assignees.length > 0) || memberEl) && (
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
                      onClick={() => setMemberEl(membersContainerRef.current)}
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
              <div className="description-title-container">
                <h3 className="description-title">Description</h3>
                <button
                  className="edit-description-button"
                  onClick={() => setIsEditorOpen(true)}
                >
                  Edit
                </button>
              </div>
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
                  className={`description-content ${
                    !cardDetails.description ? "no-description" : ""
                  }`}
                  onClick={() => setIsEditorOpen(true)}
                  dangerouslySetInnerHTML={{
                    __html: cardDetails.description
                      ? cardDetails.description
                      : "Write a clever description...",
                  }}
                />
              )}
            </div>

            <CardAttachments card={card} />
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
              <Button className="add-comment-button">Add</Button>
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

        <CardCoverMenu
          card={card}
          anchorEl={coverEl}
          isOpen={isCoverMenuOpen}
          onClose={() => setCoverEl(null)}
        />

        <CardAttachmentsMenu
          card={card}
          anchorEl={attachmentsEl}
          isOpen={isAttachmentsMenuOpen}
          onClose={() => setAttachmentsEl(null)}
        />

        <AddMemberMenu
          card={card}
          anchorEl={memberEl}
          isMemberMenuOpen={isMemberMenuOpen}
          onCloseMemberMenu={() => setMemberEl(null)}
        />

        <LabelMenu
          card={card}
          anchorEl={labelEl}
          isLabelMenuOpen={isLabelMenuOpen}
          onCloseLabelMenu={() => setLabelEl(null)}
        />
      </Box>
    </Modal>
  );
}
