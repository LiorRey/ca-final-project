import { useState } from "react";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { TextEditor } from "./ui/TextEditor";
import { Avatar } from "./ui/Avatar";
import {
  addComment,
  updateComment,
  deleteComment,
} from "../store/actions/board-actions";
import { selectCurrentUser } from "../store/selectors/auth-selectors";

export function CardComments({ card }) {
  const currentUser = useSelector(selectCurrentUser);
  const [newCommentText, setNewCommentText] = useState(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isCommentEditorOpen, setIsCommentEditorOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  async function handleAddComment() {
    if (!newCommentText || isAddingComment) return;
    try {
      setIsAddingComment(true);
      await addComment(card._id, newCommentText);
      setNewCommentText(null);
      setIsCommentEditorOpen(false);
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsAddingComment(false);
    }
  }

  function handleCancelComment() {
    setNewCommentText(null);
    setIsCommentEditorOpen(false);
  }

  function handleStartEditComment(comment) {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
    setEditingCommentText(null);
  }

  async function handleSaveEditComment() {
    if (!editingCommentText || isSavingEdit) return;
    try {
      setIsSavingEdit(true);
      await updateComment(card._id, editingCommentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText(null);
    } catch (err) {
      console.error("Failed to update comment:", err);
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(card._id, commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }

  function isOwnComment(comment) {
    if (!currentUser || !comment.author) return false;
    return (
      comment.author.userId === currentUser._id ||
      comment.author.userId?.toString() === currentUser._id?.toString()
    );
  }

  function formatCommentDate(dateInput) {
    const date = dateInput ? new Date(dateInput) : null;
    if (!date || Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  }

  return (
    <div className="card-modal-comments-content">
      <h3 className="comments-title">Comments and activity</h3>

      <div className="comment-input-section">
        {isCommentEditorOpen ? (
          <>
            <TextEditor
              compact
              content={newCommentText}
              onChange={setNewCommentText}
              placeholder="Write a comment..."
            />
            <div className="comment-editor-actions">
              <Button
                className="add-comment-button"
                onClick={handleAddComment}
                disabled={!newCommentText || isAddingComment}
              >
                {isAddingComment ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                className="cancel-comment-button"
                onClick={handleCancelComment}
                disabled={isAddingComment}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div
            className="comment-input-placeholder"
            onClick={() => setIsCommentEditorOpen(true)}
          >
            Write a comment...
          </div>
        )}
      </div>

      <div className="comments-list">
        {card.comments && card.comments.length > 0 ? (
          [...card.comments].reverse().map(comment => {
            const isEditing = editingCommentId === comment._id;
            const canModify = isOwnComment(comment);

            return (
              <div className="comment-item" key={comment._id}>
                <Avatar user={comment.author} size={32} />
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-author-name">
                      {comment.author?.fullname || comment.author?.username}
                    </span>
                    <span className="comment-date">
                      {formatCommentDate(comment.createdAt)}
                      {comment.isEdited && (
                        <span className="comment-edited"> (edited)</span>
                      )}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="comment-edit-section">
                      <TextEditor
                        compact
                        content={editingCommentText}
                        onChange={setEditingCommentText}
                      />
                      <div className="comment-editor-actions">
                        <Button
                          className="add-comment-button"
                          onClick={handleSaveEditComment}
                          disabled={!editingCommentText || isSavingEdit}
                        >
                          {isSavingEdit ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outlined"
                          className="cancel-comment-button"
                          onClick={handleCancelEditComment}
                          disabled={isSavingEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="comment-text"
                      dangerouslySetInnerHTML={{ __html: comment.text }}
                    />
                  )}

                  {canModify && !isEditing && (
                    <div className="comment-actions">
                      <button
                        type="button"
                        className="comment-action-link"
                        onClick={() => handleStartEditComment(comment)}
                      >
                        Edit
                      </button>
                      <span className="comment-action-separator">·</span>
                      <button
                        type="button"
                        className="comment-action-link"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="comments-empty">No comments yet</div>
        )}
      </div>
    </div>
  );
}
