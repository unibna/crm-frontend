// Libraries
import { map } from "lodash";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

// Components
import { Chip, Grid, Stack, Typography } from "@mui/material";

// Types
import { OperationProps } from "views/DataFlow/components/NodeOperation";

// Contants & Utils
import { OPTION_FUNC_TYPE } from "views/DataFlow/constants";

// -----------------------------------------------------------

const OperationShortCircuit = (props: OperationProps) => {
  const { control, inputFilter, setValue } = props;

  useEffect(() => {
    if (inputFilter) {
      setValue("entry_values", inputFilter);
    }
  }, [inputFilter]);

  return (
    <>
      <Controller
        name="func_type"
        control={control}
        render={({ field }) => (
          <Stack>
            <Typography variant="body2">Loại:</Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {map(OPTION_FUNC_TYPE, (item) => (
                <Grid item>
                  <Chip
                    label={item}
                    sx={{
                      color: "#fff",
                      ...(!(item === field.value) && {
                        opacity: 0.2,
                      }),
                    }}
                    onClick={() => field.onChange(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      />
    </>
  );
};

export default OperationShortCircuit;
