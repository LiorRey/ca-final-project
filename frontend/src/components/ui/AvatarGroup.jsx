import { AvatarGroup as MuiAvatarGroup } from "@mui/material";

export function AvatarGroup({ size = 24, max = 3, children, sx, ...props }) {
  const defaultSx = {
    "& .MuiAvatarGroup-avatar": {
      width: size,
      height: size,
      fontSize: size * 0.45,
    },

    "& .MuiAvatarGroup-avatar.MuiAvatarGroup-extra": {
      width: size,
      height: size,
      fontSize: size * 0.45,
    },

    ...sx,
  };

  return (
    <MuiAvatarGroup max={max} sx={defaultSx} {...props}>
      {children}
    </MuiAvatarGroup>
  );
}
