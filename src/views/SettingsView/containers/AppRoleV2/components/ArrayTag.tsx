import { styled } from "@mui/material";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material";
import { Chip } from "@mui/material";
import { Stack } from "@mui/material";

function ArrayTag({ tags }: { tags: { id: string; name: string }[] }) {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent={"center"}>
      {tags.length < 4 && tags.map((tag) => <ChipStyled key={tag.id} label={tag.name} />)}
      {tags.length > 3 && (
        <>
          {tags.slice(0, 3).map((tag) => (
            <ChipStyled key={tag.id} label={tag.name} />
          ))}
          <ChipStyled
            size="small"
            label={`+${tags.slice(3, tags.length).length}`}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default ArrayTag;

const ChipStyled = styled(Chip)(() => ({
  maxWidth: "90px",
  cursor: 'pointer'
}));
