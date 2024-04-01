import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface Props {
  row: { id: number; name: string; is_shown?: boolean; is_e_commerce?: boolean };
  handleActiveSwitch?: (att: { type: string; is_shown: boolean; id: number }) => Promise<void>;
  handleToogleEcommerceSwitch?: (att: {
    type: string;
    is_e_commerce: boolean;
    id: number;
  }) => Promise<void>;
  expanded?: boolean;
  type: string;
}

const AttributeItem = ({ row, handleActiveSwitch, handleToogleEcommerceSwitch, type }: Props) => {
  return (
    <>
      <Stack direction="row" alignItems="center" p={1} pl={3}>
        <Typography style={labelStyle}>{row.name}</Typography>
        <div
          style={
            handleActiveSwitch ? { display: "flex", justifyContent: "right" } : iconColumnStyle
          }
        >
          <Stack direction="row" alignItems={"center"}>
            {handleActiveSwitch && (
              <Tooltip title="Kích hoạt">
                <Switch
                  checked={row.is_shown}
                  onChange={(event) =>
                    handleActiveSwitch({ type, is_shown: event.target.checked, id: row.id })
                  }
                  size="small"
                />
              </Tooltip>
            )}
            {handleToogleEcommerceSwitch && (
              <Tooltip title="Kênh thương mại điện tử">
                <Switch
                  size="small"
                  checked={row.is_e_commerce}
                  onChange={(event) =>
                    handleToogleEcommerceSwitch({
                      type,
                      is_e_commerce: event.target.checked,
                      id: row.id,
                    })
                  }
                />
              </Tooltip>
            )}
          </Stack>
        </div>
      </Stack>
    </>
  );
};

export default AttributeItem;

const labelStyle = { display: "flex", flex: 1, fontSize: 14 };
const iconColumnStyle = { width: 120 };

