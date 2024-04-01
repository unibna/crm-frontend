import { SelectOptionType } from "_types_/SelectOptionType";
import { UserType } from "_types_/UserType";
import { getObjectPropSafely } from "./getObjectPropsSafelyUtil";
import { AttributeType } from "_types_/AttributeType";

export const formatOptionSelect = (option?: AttributeType | UserType): SelectOptionType => {
  return {
    label: option?.name || "",
    value: option?.id.toString() || "",
  };
};

export const filterIsShowOptions = (attributes: AttributeType[]) => {
  return getObjectPropSafely(() => attributes.length)
    ? attributes.reduce((prevArr, current) => {
        return current.is_shown || current.is_show
          ? [...prevArr, formatOptionSelect(current)]
          : prevArr;
      }, [])
    : [];
};
