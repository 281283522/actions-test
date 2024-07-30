import React from 'react';
import { createRoot } from 'react-dom/client';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import App from './App';
import 'antd/dist/reset.css';
import './main.less';

dayjs.locale('zh-cn');

const mount = createRoot(document.getElementById('root'));
mount.render(<App />);
