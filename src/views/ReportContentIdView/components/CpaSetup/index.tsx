// Libraries
import { useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import max from "lodash/max";
import min from "lodash/min";

// Components
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { Span } from "components/Labels";
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import {
  colorLabelRanking,
  optionRanking,
  TYPE_RANKING,
} from "views/ReportContentIdView/constants";

// -----------------------------------------
interface Props extends UseFormReturn<FormValuesProps, object> {
  type: string;
}

const objMax = {
  CPA: 1000000,
  CPR: 50,
};

const CpaSetup = (props: Props) => {
  const { control, watch } = props;
  const { levelOne, levelTwo, type } = watch();

  const newMarks = useMemo(() => {
    const levelMin = min([+levelOne, +levelTwo]) || 0;
    const levelMax = max([+levelOne, +levelTwo]) || 0;

    return [
      {
        value: (0 + levelMin) / 2,
        label: (
          <>
            {!!levelMin && (
              <Span variant="ghost" color={colorLabelRanking.A || "default"}>
                A
              </Span>
            )}
          </>
        ),
      },
      {
        value: levelMin,
        label: <>{!!levelMin && <Typography>{levelMin}</Typography>}</>,
      },
      {
        value: (levelMin + levelMax) / 2,
        label: (
          <>
            {!!levelMin && (
              <Span variant="ghost" color={colorLabelRanking.B || "default"}>
                B
              </Span>
            )}
          </>
        ),
      },
      {
        value: levelMax,
        label: <>{!!levelMax && <Typography>{levelMax}</Typography>}</>,
      },
      {
        value: (2 * levelMax + objMax[type.value]) / 2,
        label: (
          <>
            {!!levelMax && (
              <Span variant="ghost" color={colorLabelRanking.C || "default"}>
                C
              </Span>
            )}
          </>
        ),
      },
      {
        value: levelMax + objMax[type.value],
        label: (
          <Span variant="ghost" color={colorLabelRanking.D || "default"}>
            D
          </Span>
        ),
      },
    ];
  }, [levelOne, levelTwo, type]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Autocomplete
              fullWidth
              options={optionRanking}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              onChange={(event, newValue) => field.onChange(newValue)}
              value={field.value}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Loại xếp hạng" placeholder="Chọn loại xếp hạng" />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Sản phẩm"
              placeholder="Nhập sản phẩm"
              required={true}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="levelOne"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              error={!!error}
              helperText={error?.message}
              label="Level 1"
              placeholder="Nhập level 1"
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {type.value === TYPE_RANKING.CPA ? "vnd" : "%"}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="levelTwo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              error={!!error}
              helperText={error?.message}
              label="Level 2"
              placeholder="Nhập level 2"
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {type.value === TYPE_RANKING.CPA ? "vnd" : "%"}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sx={{ mx: 4, mt: 2 }}>
        <Slider
          disabled
          marks={newMarks}
          size="medium"
          max={(max([+levelOne, +levelTwo]) || 0) + objMax[type.value]}
          track={false}
        />
      </Grid>
    </Grid>
  );
};

export default CpaSetup;
