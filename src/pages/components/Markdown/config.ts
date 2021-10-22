import breaks from '@bytemd/plugin-breaks';
import footnotes from '@bytemd/plugin-footnotes';
import frontmatter from '@bytemd/plugin-frontmatter'; // 头部元信息
import gemoji from '@bytemd/plugin-gemoji'; // emoji😊 代码
import gfm from '@bytemd/plugin-gfm'; // 超链接、删除线、表格、任务列表
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math'; // 数学公式
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid'; // 图表 / 流程图

export const plugins = [
  breaks(),
  footnotes(),
  frontmatter(),
  gemoji(),
  gfm(),
  highlight(),
  math(),
  mediumZoom(),
  mermaid(),
];
