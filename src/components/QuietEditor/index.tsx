import React, { useContext, useEffect, useState } from 'react';
import type { OnChange, OnMount } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type { CSSProperties } from 'react';
import { Xcode_default } from '@/components/QuietEditor/themes';
import { GlobalContext } from '@/context';

interface QuietEditorProp {
  width?: string | number;
  height?: string | number;
  value?: string;
  style?: CSSProperties;
  defaultValue?: string;
  language?: string;
  defaultLanguage?: string;
  readonly?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  folding?: boolean;
  onMount?: OnMount;
  onChange?: OnChange;
  paddingBottom?: number;
  paddingTop?: number;
  renderLineHighlight?: 'all' | 'line' | 'none' | 'gutter';
}

export function QuietEditor(props: QuietEditorProp) {
  const {
    width,
    lineNumbers = 'on',
    height,
    defaultValue,
    value,
    style,
    folding = true,
    language,
    defaultLanguage,
    readonly = false,
    onMount,
    onChange,
    paddingBottom,
    paddingTop,
    renderLineHighlight = 'all',
  } = props;

  const { theme } = useContext(GlobalContext);
  const [editorValue, setEditorValue] = useState<string>(value);

  useEffect(() => {
    setEditorValue(props.value);
  }, [props.value]);

  return (
    <div
      style={{
        ...{
          borderRadius: 4,
          borderWidth: 1,
          borderColor: 'rgb(var(--gray-3))',
          borderStyle: 'solid',
          width: '100%',
        },
        ...style,
      }}
    >
      <Editor
        height={height}
        width={width}
        defaultValue={defaultValue}
        value={editorValue}
        defaultLanguage={defaultLanguage}
        language={language}
        theme={theme === 'light' ? 'x-code-default' : 'vs-dark'}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('x-code-default', Xcode_default);
        }}
        onMount={(editor, monaco) => {
          if (onMount) {
            onMount(editor, monaco);
          }
        }}
        onChange={onChange}
        options={{
          // 只读
          readOnly: readonly,
          // 关闭行数显示
          lineNumbers: lineNumbers,
          padding: {
            bottom: paddingBottom,
            top: paddingTop,
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
        }}
      />
    </div>
  );
}
