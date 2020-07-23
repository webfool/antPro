/**
 * 定义 layout 组件的默认配置信息，作为状态管理中 setting 模块的初始 state
 */
import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Reconciliation System',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;
