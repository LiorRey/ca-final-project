import React from "react";
import { Avatar as MuiAvatar } from "@mui/material";

export function Avatar({ user, size = 24 }) {
  const trelloColors = [
    "#0055CC", // Deep Blue
    "#C9372C", // Deep Red
    "#F5A623", // Deep Orange-Yellow
    "#26890C", // Deep Green
    "#0E97A0", // Deep Cyan
    "#6E36B4", // Deep Purple
    "#B83280", // Deep Pink-Magenta
    "#A87F00", // Deep Yellow-Gold
    "#596773", // Deep Gray
    "#7E8A97", // Cool Gray
  ];
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return trelloColors[Math.abs(hash) % trelloColors.length];
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
