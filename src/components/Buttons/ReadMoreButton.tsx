import { Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useMemo, useState } from "react";

interface Props {
  text: string;
  textStyles?: any;
  textShowStyles?: any;
  shortTextLength?: number;
  isShow: boolean;
}

export function ReadMoreButton(props: Props) {
  const { text, textStyles, textShowStyles, shortTextLength, isShow } = props;

  const [isReadMore, setIsReadMore] = useState(true);

  const theme = useTheme();

  const styles = useMemo(() => styleFunc({ theme }), []);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const isTextLengthCanShowReadMore = text && text.length > (shortTextLength || 150) + 10;

  return (
    <Typography component="p" sx={{ ...styles.text, ...textStyles }}>
      {isReadMore && isTextLengthCanShowReadMore
        ? text.slice(0, shortTextLength || 150) + "..."
        : text}
      {isShow && isTextLengthCanShowReadMore && (
        <Typography
          component="span"
          onClick={toggleReadMore}
          sx={{ ...styles.textShow, ...textShowStyles }}
        >
          {isReadMore ? "Xem thêm >" : " < Rút gọn"}
        </Typography>
      )}
    </Typography>
  );
}

const styleFunc = ({ theme }: { theme: Theme }) => ({
  text: {},
  textShow: {
    color: theme.palette.primary.main,
    fontSize: "0.785rem",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
    display: "inline-block",
  },
});
