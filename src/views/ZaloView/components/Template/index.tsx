// Libraries
import { useEffect, useState, useContext, useRef } from "react";
import Slider from "react-slick";
import map from "lodash/map";
import { useTheme } from "@mui/material/styles";

// Components
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import { Span } from "components/Labels";
import Image from "components/Images/Image";
import LoadingModal from "components/Loadings/LoadingModal";

// Services
import { zaloApi } from "_apis_/zalo.api";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Constants & Utils
import { fDateTime } from "utils/dateUtil";
import { handleParams } from "utils/formatParamsUtil";

// Assets
import noImageAvailable from "assets/images/no_image_available.jpg";
import { STATUS, TEMPLATE_QUALITY, TEMPLATE_TAG, TemplateItemType } from "_types_/ZaloType";
import { CarouselArrows } from "components/MCarousel/carousel";

// ---------------------------------------------------------------------

const TemplateItem = ({ item, avatar }: { item: TemplateItemType; avatar: string }) => {
  const {
    status,
    template_name,
    created,
    template_id,
    template_quality,
    price,
    template_tag,
    preview_url,
  } = item;

  const formatColor = (value: string) => {
    switch (value) {
      case TEMPLATE_QUALITY.HIGH: {
        return "success";
      }
      case TEMPLATE_QUALITY.LOW: {
        return "secondary";
      }
      case TEMPLATE_QUALITY.MEDIUM: {
        return "warning";
      }
      case TEMPLATE_QUALITY.UNDEFINED: {
        return "default";
      }
      case STATUS.ENABLE: {
        return "success";
      }
      case STATUS.DISABLE: {
        return "default";
      }
      case STATUS.DELETE: {
        return "secondary";
      }
      case STATUS.PENDING_REVIEW: {
        return "warning";
      }
      case STATUS.REJECT: {
        return "error";
      }
      case TEMPLATE_TAG.ACCOUNT_UPDATE: {
        return "primary";
      }
      case TEMPLATE_TAG.GENERAL_UPDATE: {
        return "info";
      }
      case TEMPLATE_TAG.IN_TRANSACTION: {
        return "success";
      }
      case TEMPLATE_TAG.OTP: {
        return "warning";
      }
      case TEMPLATE_TAG.POST_TRANSACTION: {
        return "secondary";
      }
      case TEMPLATE_TAG.DEFAULT: {
        return "default";
      }
      default: {
        return "info";
      }
    }
  };

  return (
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: "background.neutral" }}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt="Oa" src={avatar} />

          <div>
            <Typography variant="subtitle2">{template_name}</Typography>

            <Typography
              variant="caption"
              sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
            >
              {fDateTime(created)}
            </Typography>
          </div>
        </Stack>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
          rowSpacing={4}
          sx={{ color: "text.secondary" }}
        >
          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">Giá:</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {price ? `${price} đ` : ""}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">ID:</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {template_id}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">
              Chất lượng
              {template_quality ? (
                <Span
                  variant="filled"
                  color={formatColor(template_quality)}
                  sx={{
                    right: 16,
                    ml: 1,
                    zIndex: 9,
                    bottom: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {template_quality}
                </Span>
              ) : null}
            </Typography>
          </Grid>

          <Grid item xs={6} container direction="row" alignItems="center" spacing={2}>
            <Typography variant="caption">
              Tag
              {template_tag ? (
                <Span
                  variant="filled"
                  color={formatColor(template_tag)}
                  sx={{
                    right: 16,
                    ml: 1,
                    zIndex: 9,
                    bottom: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {template_tag}
                </Span>
              ) : null}
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <Box sx={{ p: 1, position: "relative" }}>
        <Span
          variant="filled"
          color={formatColor(status)}
          sx={{
            right: 16,
            zIndex: 9,
            bottom: 16,
            position: "absolute",
            textTransform: "capitalize",
          }}
        >
          {status}
        </Span>

        {preview_url ? (
          <iframe
            width="100%"
            height={450}
            frameBorder={0}
            src={preview_url}
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Image
            src={noImageAvailable}
            // ratio="1/1"
            sx={{ borderRadius: 1.5, height: 450 }}
          />
        )}
      </Box>
    </Paper>
  );
};

const Template = () => {
  const theme = useTheme();
  const { state: store } = useContext(ZaloContext);
  const { newCancelToken } = useCancelToken();
  const carouselRef = useRef<Slider | null>(null);
  const [dataTotal, setDataTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<TemplateItemType[]>([]);

  const {
    isRefresh,
    inView: { isViewTemplate },
    params,
    oaFilter,
  } = store;

  useEffect(() => {
    if (isViewTemplate) {
      getListTemplate();
    }
  }, [params, isRefresh, isViewTemplate, newCancelToken]);

  const getListTemplate = async () => {
    setLoading(true);

    const newParams = handleParams(params);
    const result: any = await zaloApi.get(
      {
        ...newParams,
        cancelToken: newCancelToken(),
      },
      `template/`
    );

    if (result && result.data) {
      const { results = [], count = 0 } = result.data;

      setData(results);
      setDataTotal(count);
    }

    setLoading(false);
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === "rtl"),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ py: 2, position: "relative" }}>
      {isLoading && <LoadingModal />}
      <CardHeader
        title="Template"
        subheader={`${dataTotal} template`}
        action={
          <CarouselArrows
            customIcon={"ic:round-keyboard-arrow-right"}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ "& .arrow": { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          p: 0,
          mb: 3,
          "& .MuiCardHeader-action": { alignSelf: "center" },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {map(data, (item: TemplateItemType) => (
          <TemplateItem key={item.id} item={item} avatar={oaFilter?.avatar || ""} />
        ))}
      </Slider>
    </Box>
  );
};

export default Template;
