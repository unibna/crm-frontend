import { Avatar, Box, Stack, Typography } from "@mui/material";

function UserAvatar({
  avatar,
  name,
  email,
  nameStyles,
  avatarStyles,
}: {
  avatar?: string;
  name?: string;
  email?: string;
  nameStyles?: any;
  avatarStyles?: any;
}) {
  const arrName = (name || "")?.split(" ").length >= 2 ? (name || "")?.split(" ") : ["N", "A"];
  const avatarStr = `${arrName[arrName.length - 1].charAt(0)}${arrName[arrName.length - 2].charAt(
    0
  )}`;
  return (
    <Stack direction="row" alignItems="center">
      <Avatar
        alt={name}
        src={avatar}
        sx={{
          backgroundColor: "#f7e2e27d",
          fontSize: "0.8125rem",
          color: "#14141a",
          ...avatarStyles,
        }}
      >
        {!avatar && avatarStr}
      </Avatar>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" sx={nameStyles}>
          {" "}
          {name}{" "}
        </Typography>
        {email && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {email}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default UserAvatar;
