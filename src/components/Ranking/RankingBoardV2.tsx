import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes, useTheme } from "@mui/material/styles";
import { FacebookType } from "_types_/FacebookType";
import UserAvatar from "components/Images/UserAvatar";
import useResponsive from "hooks/useResponsive";
import random from "lodash/random";
import { useEffect, useMemo, useState } from "react";
import { fValueVnd } from "utils/formatNumber";
import coin from "./icons/coin.png";

function RankingBoardV2(props: {
  titleBoard: string;
  loading?: boolean;
  data: FacebookType[];
  tableIndex: number;
  propertyOrdering: string;
  total?: any;
}) {
  const { titleBoard, loading, data, tableIndex, propertyOrdering, total } = props;
  const theme = useTheme();
  const isMobile = useResponsive("down", "sm");

  const [isFullScreen, setIsFullScreen] = useState(false);

  const styles = useMemo(() => styleFunc({ theme, loading }), [props.loading]);

  const findColorBadge: any = (index: number) =>
    ({
      0: theme.palette.error.main,
      1: theme.palette.warning.main,
      2: theme.palette.info.main,
    }[index] ?? theme.palette.success.main);

  useEffect(() => {
    document.addEventListener("fullscreenchange", () =>
      setIsFullScreen(Boolean(document.fullscreenElement))
    );
    return () => {
      document.removeEventListener("fullscreenchange", () => {});
    };
  }, []);

  return (
    <Box sx={{ ...styles.container, height: isFullScreen ? "100vh" : "calc(100vh - 80px)" }}>
      <Typography
        sx={{
          ...styles.title,
          [theme.breakpoints.down("lg")]: {
            mt: 10,
          },
        }}
        component="div"
      >
        <span>{titleBoard}</span>
        {data.length > 0 && (
          <Typography
            sx={{
              ...styles.revenue,
              fontSize: "1rem",
            }}
            component="div"
          >
            <Box
              sx={{
                ...styles.coin,
                width: "26px",
              }}
            >
              <img src={coin} alt={"đ"} />{" "}
            </Box>
            <span>{fValueVnd((total && total[propertyOrdering]) || 0)}</span>
          </Typography>
        )}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(240px, ${
            data.length < 3 ? "400px" : "auto"
          }))`,
        }}
      >
        {data.map((item, index) => (
          <Box key={index} sx={styles.wrapCard}>
            <Ribbon text={index + 1} color={findColorBadge(index)} />
            <Card sx={styles.card} key={index}>
              <Stack direction="row">
                <UserAvatar avatarStyles={styles.avatar} avatar={item.avatar} />
                <Box>
                  <Typography sx={styles.name}>{item.created_by}</Typography>
                  <Typography
                    sx={{ ...styles.revenue, justifyContent: "flex-start", fontSize: 13 }}
                    component="div"
                  >
                    <Box sx={styles.coin}>
                      <img src={coin} alt={"đ"} />{" "}
                    </Box>
                    {item[propertyOrdering as keyof typeof item] ? (
                      <>
                        <span>{fValueVnd(item[propertyOrdering as keyof typeof item] || 0)}</span>
                      </>
                    ) : (
                      "---"
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default RankingBoardV2;

const gradients = [
  "linear-gradient( 109.6deg,  rgba(247,253,166,1) 11.2%, rgba(128,255,221,1) 57.8%, rgba(255,128,249,1) 85.9%)",
  "linear-gradient( 64.3deg,  rgba(254,122,152,0.81) 17.7%, rgba(255,206,134,1) 64.7%, rgba(172,253,163,0.64) 112.1% )",
  "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,94,247,1) 17.8%, rgba(2,245,255,1) 100.2% )",
  "linear-gradient( 103.3deg,  rgba(252,225,208,1) 30%, rgba(255,173,214,1) 55.7%, rgba(162,186,245,1) 81.8% )",
  "linear-gradient( 68.4deg,  rgba(248,182,204,1) 0.5%, rgba(192,198,230,1) 49%, rgba(225,246,240,1) 99.8% )",
  "radial-gradient( circle farthest-corner at 10% 20%,  rgba(222,168,248,1) 0%, rgba(168,222,248,1) 21.8%, rgba(189,250,205,1) 35.6%, rgba(243,250,189,1) 52.9%, rgba(250,227,189,1) 66.8%, rgba(248,172,172,1) 90%, rgba(254,211,252,1) 99.7% )",
  "radial-gradient( circle farthest-corner at 10% 20%,  rgba(128,248,174,1) 0%, rgba(223,244,148,1) 90% );",
];

const fadeIn = keyframes`
from { opacity: 0; }
to   { opacity: 1; }
`;

const moveX = keyframes`
from { transform: translateX(-300px) }
to { transform: translateX(0) }
`;

const styleFunc: any = ({ theme, loading }: { theme: Theme; loading: boolean }) => ({
  container: {
    cursor: "pointer",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    boxShadow: "0 0 0 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)",
    borderRadius: "16px",
    padding: "24px",
    filter: loading ? "blur(24px)" : "none",
    height: "100vh",
    position: "relative",
    width: "100%",
    background: theme.palette.common.black,
    ...(theme.palette.mode === "light" && {
      backgroundImage: gradients[random(0, 6, false)],
      background: "#fdfefe",
    }),
  },
  title: {
    fontSize: "1.2rem",
    textTransform: "uppercase",
    fontWeight: 600,
    textAlign: "center",
    mb: 6,
  },
  revenue: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
    color: theme.palette.text.secondary,
  },
  coin: {
    width: 16,
    height: "auto",
    marginRight: "8px",
  },
  avatar: {
    width: "56px",
    height: "auto",
    aspectRatio: "1/1",
    borderRadius: "8px",
  },
  name: {
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
    fontSize: "0.925rem",
    fontWeight: 600,
  },
  wrapCard: {
    p: 0.9,
    position: "relative",
    animation: `${moveX} 1s alternate ease-in, ${fadeIn} 2s`,
  },
  card: {
    p: 0.8,
    borderRadius: "8px",
    position: "relative",
    boxShadow: `0px 10px 40px -10px rgb(0 64 128 / 20%)`,
    // background: "linear-gradient(0deg, #000, #272727)",
    // "&:before": {
    //   ...animatedCardStyle,
    // },
    // "&:after": {
    //   ...animatedCardStyle,
    //   filter: "blur(50px)",
    // },
  },
});

const animatedCardStyle = {
  content: `""`,
  position: "absolute",
  left: "-2px",
  top: "-2px",
  backgroundImage:
    "linear-gradient(45deg, #fb0094, #0000ff, #00ff00,#ffff00, #ff0000, #fb0094,#0000ff, #00ff00,#ffff00, #ff0000)",
  zIndex: "-1",
  backgroundSize: "400%",
  width: "calc(100% + 4px)",
  height: "calc(100% + 4px)",
};

const Ribbon = ({ color, text }: { color?: string; text: string | number }) => {
  return (
    <Box
      sx={{
        width: "10%",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-6.1px",
          right: "1px",
          "&:after": {
            position: "absolute",
            content: `""`,
            width: 0,
            height: 0,
            borderLeft: "16.5px solid transparent",
            borderRight: "16.5px solid transparent",
            borderTop: `10px solid ${color}`,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "block",
            textAlign: "center",
            background: `${color}`,
            lineHeight: 1,
            padding: "10px 6px 8px",
            borderTopLeftRadius: "8px",
            width: "32px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            "&:before": {
              position: "absolute",
              content: `""`,
              height: "6px",
              width: "6px",
              right: "-6px",
              top: 0,
              background: `${color}`,
              borderRadius: "0px 8px 0 0",
            },
          }}
        >
          {text}
        </Box>
      </Box>
    </Box>
  );
};
