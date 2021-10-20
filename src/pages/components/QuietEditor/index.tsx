import Editor from '@monaco-editor/react';

interface QuietEditorProp {
  width?: string | number;
  height?: string | number;
  defaultValue?: string;
  language?: string;
  readonly?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  folding?: boolean;
  renderLineHighlight?: 'all' | 'line' | 'none' | 'gutter';
}

export function QuietEditor(props: QuietEditorProp) {
  const {
    width,
    lineNumbers = 'on',
    height,
    defaultValue,
    folding = true,
    language,
    readonly = false,
    renderLineHighlight = 'all',
  } = props;

  return (
    <Editor
      height={height}
      width={width}
      defaultValue={defaultValue}
      defaultLanguage={language}
      options={{
        // 只读
        readOnly: readonly,
        // 关闭行数显示
        lineNumbers: lineNumbers,
        padding: {
          bottom: 13,
          top: 13,
        },
        smoothScrolling: true,
        // 编辑器中字体大小
        fontSize: 13,
        // 是否可以滚动到最后一行，可以往上滚动超出内容范围
        scrollBeyondLastLine: false,
        // 左边空出来的宽度
        lineDecorationsWidth: 19,
        // 关闭选中行的渲染
        renderLineHighlight: renderLineHighlight,
        // 是否折叠
        folding: folding,
        // 滚动条样式
        scrollbar: {
          verticalScrollbarSize: 5,
          horizontalScrollbarSize: 5,
        },
        // 小地图
        minimap: {
          enabled: false,
        },
      }}
    />
  );
}
