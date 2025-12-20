import React from "react";
import { Avatar as MuiAvatar } from "@mui/material";

const TRELLO_COLORS = [
  "#0066FF", // Bold Blue
  "#E53935", // Bold Red
  "#FFB300", // Bold Orange-Yellow
  "#43A047", // Bold Green
  "#00ACC1", // Bold Cyan
  "#8E24AA", // Bold Purple
  "#E91E63", // Bold Pink-Magenta
  "#FDD835", // Bold Yellow-Gold
  "#424242", // Bold Dark Gray
  "#616161", // Bold Medium Gray
];

export function Avatar({ user, size = 24 }) {
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return TRELLO_COLORS[Math.abs(hash) % TRELLO_COLORS.length];
  }

  function stringAvatar(name) {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";

    return {
      sx: {
        bgcolor: stringToColor(name),
        fontSize: size * 0.45,
      },
      children: `${first}${second}`,
    };
  }

  const avatarProps = stringAvatar(user.fullname);

  return (
    <MuiAvatar
      sx={{
        width: size,
        height: size,
        ...avatarProps.sx,
      }}
      alt={user.fullname}
    >
      {avatarProps.children}
    </MuiAvatar>
  );
}
