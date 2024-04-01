// Components
import WrapFilterChip from "components/Chips/FilterChip/WrapFilterChip";
import FilterItem from "components/Chips/FilterChip/FilterChipItem";

interface Props {
  params: any;
  dataRender: DataRenderType[];
  isDisabledClearAll?: boolean;
  onClearAll: () => void;
}

type DataRenderType = {
  title?: string;
  value?:
    | {
        label: string;
        onRemove?: any;
      }[]
    | {
        label: string;
        onRemove?: any;
      };
};

const SliderFilter = (props: Props) => {
  const { onClearAll, dataRender = [], isDisabledClearAll = true } = props;

  return (
    <WrapFilterChip
      isActiveClearAllButton={{ disabled: isDisabledClearAll, keysFilter: ["data_from"] }}
      onClearAll={onClearAll}
    >
      <>
        {dataRender?.map((item, index) => {
          return <FilterItem key={index} {...item} />;
        })}
      </>
    </WrapFilterChip>
  );
};

export default SliderFilter;
