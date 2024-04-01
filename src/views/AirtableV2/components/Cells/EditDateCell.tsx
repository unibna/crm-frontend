import { DatePicker } from "@mui/lab";
import { useRef, useState } from "react";
import { dateIsValid } from "utils/helpers";
import EditText from "../EditText";

export const EditDateCell = ({
  value,
  isOriginal,
  onChange,
}: {
  value: any;
  isOriginal?: boolean;
  onChange: (newValue: any) => void;
}) => {
  const inputRef = useRef<any>();
  const [temp, setTemp] = useState<any>();

  return (
    <DatePicker
      value={value}
      onChange={(date) => {
        setTemp(date);
      }}
      renderInput={(params) => (
        <EditText
          {...params}
          isOriginal={isOriginal}
          onKeyUp={(event: any) => {
            if (event.key == "Enter" && temp && dateIsValid(temp)) {
              onChange(new Date(temp).toISOString());
            }
          }}
        />
      )}
      inputRef={inputRef}
      // open={isOriginal ? undefined : true}
      onAccept={(date) => {
        onChange(date ? date : "");
      }}
    />
  );
};
