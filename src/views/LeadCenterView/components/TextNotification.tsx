import styled, { keyframes } from "@mui/styled-engine";

const TextNotification = ({
  refresh,
  message,
  newItem,
}: {
  refresh?: () => void;
  message: string;
  newItem?: number;
}) => {
  if (!newItem) {
    return null;
  }

  return (
    <NotificationLabel onClick={refresh && refresh}>
      {message}
      <DotPusleAni />
    </NotificationLabel>
  );
};

export default TextNotification;

const pulse = keyframes`
  ${"0%"} {
    transform:scale(0.9);
    box-shadow: 0 0 0 0 rgba(255,82,82,0.7)
  }
  ${"70%"} {
    transform:scale(1);
    box-shadow: 0 0 0 10px rgba(255,82,82,0)
  }
  ${"100%"}{
    transform:scale(0.9)
  }
`;

const DotPusleAni = styled("div")({
  backgroundColor: "rgba(255, 82, 82, 1)",
  width: 10,
  height: 10,
  borderRadius: "50%",
  animation: `${pulse} 2s infinite`,
  marginLeft: 5,
});

const NotificationLabel = styled("label")({
  fontSize: 13,
  cursor: "pointer",
  color: "rgba(255, 82, 82, 1)",
  display: "flex",
  flex: 1,
  justifyContent: "flex-end",
  fontWeight: "bold",
  alignItems: "center",
  position: "absolute",
  right: 0,
  top: 0,
});
