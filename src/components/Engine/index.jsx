import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebContainer } from '@webcontainer/api';
import { message, Modal } from 'antd';
import MainApp from '~/components/Main/App/App';
import 'xterm/css/xterm.css';
import './index.less';
import { formatServerData, getFilesArrByCtx, selectDirectory, writeDataToFile } from '../../shared/utils';
import testData from './obj';

function Engine(props) {
  const [treeData, setTreeData] = useState(testData);
  const iframeRef = useRef();
  const fitAddonRef = useRef();
  const terminalElRef = useRef();
  const terminalRef = useRef();
  const webCtx = useRef();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [resData, setResData] = useState();
  const [iframeSrc, setIframeSrc] = useState();

  useEffect(() => {
    getDetail();
  }, []);

  const beforeunload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  const versionAdd = () => {
    setResData({
      ...resData,
      version: resData?.version + 1
    });
  };

  const putData = async () => {
    let ar = await getFilesArrByCtx(webCtx.current, '/', true);
    console.log(JSON.stringify(ar));
  };

  // 保存
  const onSave = async () => {
    const res = await putData();
  };

  // 初始化
  const getDetail = async () => {
    handleWindowLoad(treeData);
  };

  // 导入
  const onImport = async () => {
    let res = await selectDirectory();
    let data = await getFilesArrByCtx(webCtx.current, '/');
    data = JSON.stringify(data);
    console.log(data);
  };

  // 命令行处理
  const shellAction = async (key, params) => {
    const terminal = terminalRef.current;
    const installProcess = await webCtx.current.spawn(key, params);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (params && params.includes('gbs123456')) {
            terminal.write('授权中\n');
          } else {
            terminal.write(data);
          }
        }
      })
    );
    return installProcess.exit;
  };

  const onResize = () => {
    fitAddonRef.current?.fit && fitAddonRef.current?.fit();
  };

  const handleWindowLoad = async (treeData) => {
    let webcontainerInstance;
    const terminalEl = terminalElRef.current;
    const iframeEl = iframeRef.current;
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    const terminal = new Terminal({
      convertEol: true
    });
    terminalRef.current = terminal;
    terminal.loadAddon(fitAddon);
    terminal.open(terminalEl);
    fitAddon.fit();

    // call only once
    webcontainerInstance = await WebContainer.boot();
    webCtx.current = webcontainerInstance;
    window.webCtx = webcontainerInstance;
    setLoading(false);
    await webcontainerInstance.mount({});

    try {
      let ar = formatServerData(treeData);
      await writeDataToFile(webCtx.current, ar);
    } catch (e) {
      console.error(e);
    }

    webcontainerInstance.on('server-ready', (port, url) => {
      setIframeSrc(url);
      iframeEl.src = url;
    });

    const shellProcess = await startShell(terminal);
    window.addEventListener('resize', () => {
      fitAddon.fit();
      shellProcess.resize({
        cols: terminal.cols,
        rows: terminal.rows
      });
    });

    async function startShell(terminal) {
      const shellProcess = await webcontainerInstance.spawn('jsh', {
        terminal: {
          cols: terminal.cols,
          rows: terminal.rows
        }
      });
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          }
        })
      );
      const input = shellProcess.input.getWriter();
      terminal.onData(data => {
        input.write(data);
      });
      return shellProcess;
    }
  };

  const download = (blob, name) => {
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = name || 'dir.zip';
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainApp
      onResize={onResize}
      loading={loading}
      treeData={treeData}
      shellAction={shellAction}
      toolBarProps={{
        detail: resData,
        onLocalImportChange: onImport,
        onDownloadAction: async () => {
          await onSave();
        }
      }}
      headerBarProps={{
        saveLoading: saveLoading,
        publishLoading: publishLoading,
        onSave: onSave,
      }}
      iframe={<div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%'
        }}
      >
        <iframe
          ref={iframeRef}
          style={{
            height: '100%',
            width: '100%',
            border: 'none'
          }}
        >请先启动项目</iframe>
        {!iframeSrc && <div
          style={{
            position: 'absolute',
            top: '0',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            alignItems: 'center'
          }}
        >
          请先在终端启动项目！
        </div>}
      </div>}
      terminal={<div
        ref={terminalElRef}
        className="terminal"
        style={{
          height: '100%',
          width: '100%'
        }}
      ></div>}
    >
    </MainApp>
  );
}

export default Engine;