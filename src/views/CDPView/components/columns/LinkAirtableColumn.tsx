
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from '@mui/material/Link';

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const LinkAirtableColumn = (props: Props) => {
  const Formatter = ({ value }: { value?: any }) => {
    const { href, label } = value
    return (
      <Link
        href={href}
        style={{ display: 'flex', alignItems: 'center' }}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </Link>
    )
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default LinkAirtableColumn;
