import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Editor, { loader, useMonaco } from "@monaco-editor/react";

loader.config({
  paths: { vs: "https://jjboss.oss-cn-hangzhou.aliyuncs.com/jjb-saas/vscode" },
});

function Monaco(props) {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const handleEditorDidMount = function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  };

  return (
    <Editor
      value={props.value}
      theme={"vs-dark"}
      height="100%"
      defaultLanguage={props.language}
      onMount={handleEditorDidMount}
      onChange={props.onChange}
    />
  );
}

export default Monaco;
