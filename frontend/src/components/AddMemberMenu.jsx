import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { PopoverMenu } from "./ui/PopoverMenu";
import { Avatar } from "./ui/Avatar";
import { editCard } from "../store/actions/board-actions";
import "../assets/styles/components/AddMemberMenu.css";

export function AddMemberMenu({
  boardId,
  listId,
  card,
  anchorEl,
  isMemberMenuOpen,
  onCloseMemberMenu,
  onUpdateCard,
  sx,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { boardId: paramsBoardId } = useParams();
  const currentBoardId = boardId || paramsBoardId;

  const members = useSelector(state => state.boards.board.members);

  const { cardMembers, boardMembers } = useMemo(() => {
    const filtered = members.filter(
      member =>
        member.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cardMemberIds = card.assignedTo || [];
    const cardMembersList = filtered.filter(member =>
      cardMemberIds.includes(member._id)
    );
    const boardMembersList = filtered.filter(
      member => !cardMemberIds.includes(member._id)
    );

    return {
      cardMembers: cardMembersList,
      boardMembers: boardMembersList,
    };
  }, [members, searchTerm, card.assignedTo]);

  function handleCloseMemberMenu() {
    setSearchTerm("");
    onCloseMemberMenu();
  }

  function handleAddMember(memberId) {
    const updatedAssignedTo = card.assignedTo
      ? [...card.assignedTo, memberId]
      : [memberId];

    const updatedCard = {
      ...card,
      assignedTo: updatedAssignedTo,
    };

    editCard(currentBoardId, updatedCard, listId);
    if (onUpdateCard) {
      onUpdateCard(updatedCard);
    }
  }

  function handleRemoveMember(memberId) {
    const updatedAssignedTo = card.assignedTo
      ? card.assignedTo.filter(id => id !== memberId)
      : [];

    const updatedCard = {
      ...card,
      assignedTo: updatedAssignedTo,
    };

    editCard(currentBoardId, updatedCard, listId);
    if (onUpdateCard) {
      onUpdateCard(updatedCard);
    }
  }

  return (
    <PopoverMenu
      anchorEl={anchorEl}
      isOpen={isMemberMenuOpen}
      onClose={handleCloseMemberMenu}
      title="Members"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
      sx={sx}
    >
      <div className="member-menu-content">
        <input
          type="text"
          className="member-search"
          placeholder="Search members..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
        />

        {cardMembers.length > 0 && (
          <>
            <label className="member-menu-label">Card members</label>
            <ul className="members-list">
              {cardMembers.map(member => (
                <li
                  key={member._id}
                  className="member-menu-item card-member-item"
                >
                  <div className="member-item-label">
                    <Avatar user={member} size={32} />
                    <span className="member-name">
                      {member.fullname || member.username}
                    </span>
                  </div>
                  <button
                    className="member-remove-button"
                    onClick={() => handleRemoveMember(member._id)}
                    aria-label={`Remove ${member.fullname || member.username}`}
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <label className="member-menu-label">Board members</label>
        <ul className="members-list">
          {boardMembers.length > 0 ? (
            boardMembers.map(member => (
              <li
                key={member._id}
                className="member-menu-item board-member-item"
                onClick={() => handleAddMember(member._id)}
              >
                <div className="member-item-label">
                  <Avatar user={member} size={32} />
                  <span className="member-name">
                    {member.fullname || member.username}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="no-members-found">No members found</li>
          )}
        </ul>
      </div>
    </PopoverMenu>
  );
}
