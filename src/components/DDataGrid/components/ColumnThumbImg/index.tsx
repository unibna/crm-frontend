// Libraries
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";

// Components
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Assets
import imageNotFound from "assets/images/image_not_found.png";
import imageSkylink from "assets/images/icon-logo.png";

export const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: "cover",
  margin: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadiusMd,
}));

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ColumnThumbImg = (props: Props) => {
  const Formatter = ({ value: { url: urlProps, id, body, href, title } }: { value: any }) => {
    const [url, setUrl] = useState(urlProps);
    const theme = useTheme();

    const handleErrorImage = (event: any) => {
      setUrl(imageNotFound);
    };

    return (
      <Tooltip title={url || ""} placement="bottom-start">
        {id || href ? (
          <Stack direction="row">
            <ThumbImgStyle alt={""} src={url || imageSkylink} />
            <Stack>
              {title ? (
                <Typography variant="subtitle2" noWrap>
                  {title}
                </Typography>
              ) : null}
              {body ? (
                <Link
                  variant="body2"
                  target="_blank"
                  rel="noreferrer"
                  href={href ? href : "http://facebook.com/" + (id && id.split("_")[1])}
                  sx={{ ...linkStyle }}
                  color={theme.palette.secondary.main}
                >
                  <Typography variant="subtitle2" noWrap>
                    {body}
                  </Typography>
                </Link>
              ) : null}
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row">
            <ThumbImgStyle alt={""} src={url || imageSkylink} />
            <Stack>
              {title ? (
                <Typography variant="subtitle2" noWrap>
                  {title}
                </Typography>
              ) : null}
              {body ? (
                <Typography variant="subtitle2" noWrap>
                  {body}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        )}
      </Tooltip>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default ColumnThumbImg;

const linkStyle = { textDecoration: "initial" };
