import { AirTableColumnTypes } from "_types_/SkyTableType";
import { useEffect, useRef, useState } from "react";
import { formatDuration, isNumeric } from "utils/helpers";
import EditText from "../EditText";

export const EditTextCell = ({
  value,
  isOriginal,
  type,
  onChange,
}: {
  value: any;
  isOriginal?: boolean;
  type: AirTableColumnTypes;
  onChange: (newValue: any) => void;
}) => {
  const inputRef = useRef<any>();
  const [innerValue, setInnerValue] = useState(value);

  const inputValueRef = useRef(value);
  const inputDefaultValueRef = useRef(value);

  let handleBlur = () => {
    inputRef?.current?.value !== value && onChange(inputRef?.current?.value);
  };

  let handleKeyUp = (event: any) => {
    if (event.key == "Enter") {
      handleBlur();
    }
  };

  useEffect(() => {
    inputValueRef.current = innerValue;
  }, [innerValue]);

  useEffect(() => {
    return () => {
      inputValueRef?.current !== inputDefaultValueRef?.current && onChange(inputValueRef?.current);
    };
  }, []);

  let inputType;
  let placeholder = "";
  let rows;
  let multiline;
  let styles;

  switch (type) {
    case AirTableColumnTypes.LONG_TEXT:
      multiline = true;
      rows = 6;
      handleKeyUp = () => {};
      break;
    case AirTableColumnTypes.DURATION:
      handleBlur = () => {
        const duration = formatDuration(inputRef?.current?.value);
        duration !== value && onChange(duration);
      };
      placeholder = "hh:mm";
      break;

    case AirTableColumnTypes.PHONE_NUMBER:
      inputType = "tel";
      break;

    case AirTableColumnTypes.EMAIL:
      inputType = "email";
      break;
    case AirTableColumnTypes.URL:
      inputType = "url";
      break;
    case AirTableColumnTypes.NUMBER:
    case AirTableColumnTypes.CURRENCY:
    case AirTableColumnTypes.PERCENT:
      handleBlur = () => {
        +inputRef?.current?.value !== +value &&
          isNumeric(inputRef?.current?.value) &&
          onChange(+inputRef?.current?.value);
      };
      break;
    default:
      break;
  }

  return (
    <EditText
      autoFocus
      sx={styles}
      isOriginal={isOriginal}
      inputRef={inputRef}
      defaultValue={value}
      multiline={multiline}
      rows={rows}
      type={inputType}
      placholder={placeholder}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      onChange={(e: any) => {
        setInnerValue(e.target.value);
      }}
    />
  );
};
