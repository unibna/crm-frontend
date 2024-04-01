import Chip from "@mui/material/Chip";

export const RANK_CHIP_OPTIONS: { value: string | number; color: string; label: string }[] = [
  { label: "Bạc", value: 1, color: "#95a5a6" },
  { label: "Vàng", value: 2, color: "#FFDF00" },
  { label: "Kim cương", value: 3, color: "#1E90FF" },
  { label: "VIP", value: 4, color: "#FFC0CB" },
];

const RankField = ({ value }: { value?: string }) => {
  const rank = RANK_CHIP_OPTIONS.find((item) => item.value.toString() === value?.toString());
  return (
    <Chip
      label={rank?.label || "Chưa có"}
      size="small"
      style={{
        borderColor: rank?.color || "text.secondary",
        backgroundColor: rank?.color || "text.secondary",
        color: rank?.color ? "#ffffff" : "unset",
        fontWeight: rank?.color ? "bold" : "unset",
      }}
      variant="outlined"
    />
  );
};

export default RankField;
