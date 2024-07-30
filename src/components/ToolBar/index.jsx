import React from 'react';
import './index.less';
import { Tooltip, Button, Modal, Descriptions } from 'antd';
import Icon, {
  ExportOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  CodeOutlined
} from '@ant-design/icons';

export default class ToolBar extends React.Component {
  state = {
    openDrawerDependencies: false
  };

  render () {
    const { openDrawerDependencies } = this.state;
    return (
      <>
        <div className="engine-tool-bar">
          <div className="engine-tool-items">
            <Tooltip
              title="项目导入"
              placement="right"
            >
              <div
                className="engine-tool-item"
                onClick={() => this.props.onLocalImportChange()}
              >
                <ImportOutlined />
              </div>
            </Tooltip>
            <Tooltip
              title="项目导出"
              placement="right"
            >
              <div
                className="engine-tool-item"
                onClick={() => this.props.onDownloadAction()}
              >
                <ExportOutlined />
              </div>
            </Tooltip>
          </div>
          <div
            className="engine-tool-login-out"
            onClick={() => this.props.onTerminalChange()}
          >
            <Tooltip
              title="终端"
              placement="top"
            >
              <CodeOutlined />
            </Tooltip>
          </div>
        </div>
      </>
    );
  }
}
