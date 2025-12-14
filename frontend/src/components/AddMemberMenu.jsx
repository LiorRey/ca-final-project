import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { PopoverMenu } from "./ui/PopoverMenu";
import { Avatar } from "./ui/Avatar";
import { addAssignee, removeAssignee } from "../store/actions/board-actions";
import "../assets/styles/components/AddMemberMenu.css";

export function AddMemberMenu({
  card,
  anchorEl,
  isMemberMenuOpen,
  onCloseMemberMenu,
  sx,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const members = useSelector(state => state.boards.board.members);

  const { cardMembers, boardMembers } = useMemo(() => {
    const cardAssignees = card.assignees || [];

    const boardMembersList = members.filter(
      member =>
        !cardAssignees.some(assignee => assignee.userId === member.userId)
    );

    const filteredMembers = boardMembersList.filter(member =>
      member.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAssignees = cardAssignees.filter(assignee =>
      assignee.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      cardMembers: filteredAssignees,
      boardMembers: filteredMembers,
    };
  }, [members, searchTerm, card.assignees]);

  function handleCloseMemberMenu() {
    setSearchTerm("");
    onCloseMemberMenu();
  }

  function handleAddAssignee(userId) {
    addAssignee(card._id, userId);
  }

  function handleRemoveAssignee(userId) {
    removeAssignee(card._id, userId);
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
                    onClick={() => handleRemoveAssignee(member.userId)}
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
                onClick={() => handleAddAssignee(member.userId)}
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
