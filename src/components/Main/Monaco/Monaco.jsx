import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Editor, { loader, useMonaco } from '@monaco-editor/react';
import { Spin, Menu, Dropdown, Button } from 'antd';


function Monaco (props) {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const handleEditorDidMount = function handleEditorDidMount (editor, monaco) {
    editor.addAction({
      id: 'save',
      label: 'save',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
      ],
      run: function (ed) {
        let val = editor.getValue();
        props.onChange(val);
      }
    });
    editorRef.current = editor;
  };
  return (
    <Editor
      path={props?.path}
      value={props.value}
      theme={'vs-dark'}
      height="100%"
      loading={<Spin />}
      defaultLanguage={props.language}
      onMount={handleEditorDidMount}
      onChange={props.onChange}
    />
  );
}

export default Monaco;
