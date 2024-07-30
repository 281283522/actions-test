import React from 'react';
import {
  FileImageOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import css from '~/assets/svg/css.svg';
import html from '~/assets/svg/html.svg';
import image from '~/assets/svg/image.svg';
import javascript from '~/assets/svg/javascript.svg';
import json from '~/assets/svg/json.svg';
import less from '~/assets/svg/less.svg';
import reactIcon from '~/assets/svg/react.svg';
// import npm from '~/assets/svg/npm.svg'
// import terminal from '~/assets/svg/terminal.svg'
// import typescript from '~/assets/svg/typescript.svg'
// import yarn from '~/assets/svg/yarn.svg'

const CustomIcon = ({
  ext,
  width = 14,
  height = 14
}) => {
  let src = '';
  switch (ext) {
  case 'js':
    src = javascript;
    break;
  case 'jsx':
    src = reactIcon;
    break;
  case 'html':
  case 'htm':
    src = html;
    break;
  case 'less':
    src = less;
    break;
  case 'json':
    src = json;
    break;
  case 'css':
    src = css;
    break;
  case 'png':
  case 'jpg':
  case 'jpeg':
  case 'gif':
  case 'svg':
    src = image;
    break;
  }
  return <img
    src={src}
    width={width}
    height={height}
  />;
};

export const TypeIcon = (props) => {
  if (props.droppable) {
    return props.isOpen
      ? <FolderOpenOutlined />
      : <FolderOutlined />;
  }

  const text = props.item.text;
  const ext = text.split('.')
    .pop();
  return <CustomIcon ext={ext} />;
};
