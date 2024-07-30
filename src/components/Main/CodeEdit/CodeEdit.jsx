import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Monaco from '../Monaco/Monaco';
import { usePageContext } from '../App/App';
import { getMimeType, supportImgFile } from '~/shared/utils';

function detectFileLanguage (fileName = 'file') {
  const lowerCaseFileName = fileName.toLowerCase();
  switch (lowerCaseFileName.split('.')
    .pop()) {
  case 'js':
  case 'jsx':
    return 'JavaScript';
    break;
  case 'py':
    return 'Python';
    break;
  case 'java':
    return 'Java';
    break;
  case 'html':
  case 'htm':
    return 'HTML';
    break;
  case 'css':
    return 'CSS';
    break;
  case 'less':
    return 'CSS';
  case 'json':
    return 'JSON';
    break;
  default:
    return '';
    break;
  }
}

const CodeEdit = function (props) {
  const {
    barAr,
    activeFile
  } = usePageContext();
  const [ isImg, setIsImg ] = useState(false);
  const [ val, setVal ] = useState(undefined);
  const [ loading, setLoading ] = useState(false);
  const getVal = async (activeFile) => {
    if (window.webCtx) {
      let id = activeFile?.id;
      let isImg = supportImgFile(activeFile?.text);
      setIsImg(isImg);
      setLoading(true);
      let bytes = '';
      if (isImg) {
        let mime = getMimeType(activeFile?.text);
        let val = await window.webCtx.fs.readFile(id, 'base64');
        val = `${mime},${val}`;
        bytes = val;
      } else {
        bytes = await window.webCtx.fs.readFile(id, 'utf-8');
      }
      setLoading(false);
      setVal(bytes);
    }
  };

  useEffect(() => {
    getVal(activeFile);
  }, [ activeFile ]);

  const onSave = async (value) => {
    if (window.webCtx && activeFile?.id) {
      await window.webCtx.fs.writeFile(activeFile?.id, value);
    }
  };

  let id = activeFile?.id;
  let row = barAr.find(item => item.id === id);
  if (!row) {
    return <div
      style={{
        height: '100%',
        width: '100%',
        background: '#37373d'
      }}
    >
    </div>;
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%'
      }}
    >
        {isImg
          ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                position: 'relative',
                backgroundColor: '#f0f0f0',
                backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}
            >
            <img
              src={val}
              alt=""
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90%',
                maxHeight: '90%'
              }}
            />
            </div>
          )
          : (
            <div
              style={{
                height: '100%'
              }}
            >
              <Monaco
                value={val}
                path={activeFile?.id}
                language={detectFileLanguage(activeFile?.text)
                  .toLowerCase()}
                onChange={(value, event) => {
                  setVal(value);
                  onSave(value);
                }}
              />
            </div>
          )}
        </div>
  );
};

export default CodeEdit;
