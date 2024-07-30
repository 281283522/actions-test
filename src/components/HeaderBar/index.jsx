import React from 'react';
import './index.less';
import { Button } from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  SaveOutlined
} from '@ant-design/icons';

export default function (props) {
  return (
    <div
      className="engine-header-bar"
      style={{
        display: 'flex',
        justifyContent: 'end'
      }}
    >
      <div className="engine-header-bar-action">
        <div className="engine-header-bar-action-btn">
          <Button
            type="text"
            icon={<SaveOutlined />}
            style={{ height: 49 }}
            loading={props?.saveLoading}
            onClick={() => props.onSave()}
          >
            保存
          </Button>
        </div>
        <div className="engine-header-bar-action-btn">
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            style={{ height: 49 }}
            onClick={() => props.onPreviewChange()}
          >
            预览
          </Button>
        </div>
      </div>
    </div>
  );
}
