import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { Box, styled, useTheme } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useMemo } from "react";

const regexKeyValue = /\{\{\$(.*?)\}\}/g;
const regexValueKey = /\{\{(.*?)\}\}/g;

export const ExpressionField = ({
  options = [],
  value = "",
  onChange,
}: {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (newValue: string) => void;
}) => {
  const theme = useTheme();
  const objectKeyValue = options.reduce(
    (prev, current) => ({
      ...prev,
      [current.label]: current.value,
    }),
    {}
  );
  const objectValueKey = options.reduce(
    (prev, current) => ({
      ...prev,
      [current.value]: current.label,
    }),
    {}
  );

  const tagOptions = options.map((tag) => ({
    label: "@" + tag.label,
    type: "variable",
    apply: "{{$" + tag.label + "}}",
  }));

  const handleChange = useCallback((value, viewUpdate) => {
    const newValue = value.replace(regexKeyValue, function (match: any, token: any) {
      return "{{" + objectKeyValue[token] + "}}";
    });
    onChange(newValue);
  }, []);

  function completeJSDoc(context: CompletionContext) {
    let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
    let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
    let tagBefore = /@\w*$/.exec(textBefore);
    if (!tagBefore && !context.explicit) return null;
    return {
      from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
      options: tagOptions,
      validFor: /^(@\w*)?$/,
    };
  }

  const extensions = [
    javascript({ jsx: true }),
    autocompletion({ override: [completeJSDoc] }),
    EditorView.lineWrapping,
  ];

  const valueToShow = useMemo(() => {
    return value.replace(regexValueKey, function (match: any, token: any) {
      return "{{$" + objectValueKey[token] + "}}";
    });
  }, [value]);

  return (
    <Wrapper>
      <CodeMirror
        value={valueToShow}
        extensions={extensions}
        onChange={handleChange}
        height="auto"
        minHeight="54px"
        basicSetup={{ lineNumbers: false, foldGutter: false }}
        theme={theme.palette.mode}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  "& .cm-editor": {
    fontSize: "14px",
    borderRadius: "8px",
    border: `1.5px solid ${theme.palette.grey[300]}`,
    "&.cm-focused": {
      outline: `1.5px solid ${theme.palette.primary.main}`,
    },
    ".cm-content": {
      padding: "8px 0",
    },
  },
}));
