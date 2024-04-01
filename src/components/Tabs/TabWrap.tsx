interface Props {
  value: number;
  index: number;
  children: React.ReactNode;
}

export const TabWrap = ({ value, index, children }: Props) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ flexGrow: 1 }}
    >
      {index === value && children}
    </div>
  );
};
