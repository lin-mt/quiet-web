import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter'; // 头部元信息
import gemoji from '@bytemd/plugin-gemoji'; // emoji😊 代码
import gfm from '@bytemd/plugin-gfm'; // 超链接、删除线、表格、任务列表
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math'; // 数学公式
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid'; // 图表 / 流程图
import mermaid_zhHans from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import math_zhHans from '@bytemd/plugin-math/locales/zh_Hans.json';
import gfm_zhHans from '@bytemd/plugin-gfm/locales/zh_Hans.json';

export const plugins = [
  breaks(),
  frontmatter(),
  gemoji(),
  gfm({ locale: gfm_zhHans }),
  highlight(),
  math({ locale: math_zhHans }),
  mediumZoom(),
  mermaid({ locale: mermaid_zhHans }),
];
