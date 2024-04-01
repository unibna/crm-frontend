import { CardProps } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import ConfettiProvider from "contexts/ConfettiContext";
import useResponsive from "hooks/useResponsive";
import map from "lodash/map";
import { useRef, useState } from "react";
import Slider from "react-slick";
import { CarouselArrows, CarouselDots } from "./carousel";
// components
import lightLogo from "assets/images/logo-text-black.svg";
import darkLogo from "assets/images/logo-text-white.svg";
interface Props extends CardProps {
  list: JSX.Element[];
  isControlFullScreen?: boolean;
  rangeDate: JSX.Element;
}

export default function AppFeatured({ list, isControlFullScreen, rangeDate, ...other }: Props) {
  const theme = useTheme();
  const isMobile = useResponsive("down", "sm");

  const carouselRef = useRef<Slider>(null);

  const [currentIndex, setCurrentIndex] = useState(theme.direction === "rtl" ? list.length - 1 : 0);

  const settings = {
    speed: 1500,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 8000,
    slidesToShow: 1,
    slidesToScroll: 1,
    loop: true,
    rtl: Boolean(theme.direction === "rtl"),
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
    ...CarouselDots({
      zIndex: 9,
      top: 24,
      left: 24,
      position: "absolute",
      // color: "#fff",
    }),
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const requestFullscreen = (ele: any) => {
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
      ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen();
    } else {
      console.log("Fullscreen API is not supported.");
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else {
      console.log("Fullscreen API is not supported.");
    }
  };

  return (
    <Card {...other}>
      <ConfettiProvider>
        <Slider ref={carouselRef} {...settings}>
          {map(list, (item, index) => (
            <CarouselItem key={index} isActive={index === currentIndex}>
              {item}
            </CarouselItem>
          ))}
        </Slider>
      </ConfettiProvider>
      {isControlFullScreen && (
        <Button
          variant="outlined"
          onClick={(e) => {
            e.preventDefault();
            document.fullscreenElement
              ? exitFullscreen()
              : requestFullscreen(document.getElementById("appFeatured"));
          }}
          sx={{
            position: "absolute",
            top: 16,
            right: 200,
            padding: "4px",
            fontSize: "0.675rem",
            width: "fit-content",
            ...(isMobile && {
              top: 60,
              left: 100,
            }),
          }}
        >
          {document.fullscreenElement ? "Thu nhỏ" : "Toàn màn hình"}
        </Button>
      )}

      {document.fullscreenElement && rangeDate}
      <Logo />

      <CarouselArrows
        onNext={handleNext}
        onPrevious={handlePrevious}
        spacing={0}
        sx={{
          top: 16,
          right: 300,
          position: "absolute",
          "& .arrow": {
            p: 0,
            width: 32,
            height: 32,
            opacity: 0.48,
            color: "common.white",
            "&:hover": { color: "common.white", opacity: 1 },
          },
          ...(isMobile && {
            top: 60,
            left: 16,
          }),
        }}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  children: JSX.Element;
  isActive?: boolean;
};

function CarouselItem({ children, isActive }: CarouselItemProps) {
  return <Box sx={{ position: "relative" }}>{children}</Box>;
}

const Logo = () => {
  const isMobile = useResponsive("down", "sm");
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...styles.logo,
        ...(isMobile && {
          width: 96,
        }),
      }}
    >
      <img
        src={theme.palette.mode === "light" ? lightLogo : darkLogo}
        alt="Skylink Group"
        style={styles.imageLogo}
      />
    </Box>
  );
};

const styles: any = {
  logo: {
    width: "128px",
    height: "auto",
    position: "absolute",
    top: 16,
    right: 24,
  },
  imageLogo: {
    objectFit: "contain",
    objectPosition: "center",
    position: "absolute",
  },
};
