import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "lodash/isEqual";

const useReselect = createSelectorCreator(
  defaultMemoize,
  isEqual
);

export default useReselect;

