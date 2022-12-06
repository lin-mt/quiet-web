import React, { useEffect, useRef, useState } from 'react';
import { Card, ResizeBox, Space, Tooltip } from '@arco-design/web-react';
import { QuietEditor } from '@/components/QuietEditor';
import styles from '@/components/QuietMarkdown/style/index.module.less';
import Toolbar from '@/components/QuietMarkdown/toolbar';
import {
  IconFullscreen,
  IconFullscreenExit,
} from '@arco-design/web-react/icon';
import QuietMarkdownViewer from '@/components/QuietMarkdown/QuietMarkdownViewer';
import styled from 'styled-components';
import { IconLeftExpand, IconRightExpand } from '@/components/icon';

export const Option = styled.div`
  background-color: rgb(var(--gray-2));
  border-radius: var(--border-radius-small);
  color: var(--color-text-1);
  padding: 0 8px;
  line-height: 26px;
  height: 26px;
  font-size: 14px;
  cursor: pointer;

  :hover {
    background-color: rgb(var(--gray-3));
  }
`;

export type QuietMarkdownProp = {
  value?: string;
  zIndex?: number;
  height?: string | number;
  onChange?: (value: string) => void;
};

function QuietMarkdown(props: QuietMarkdownProp) {
  const { zIndex = 1000, height = '50vh' } = props;
  const [value, setValue] = useState<string>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fsTtVisible, setFsTtVisible] = useState<boolean>(false);
  const [onlyEditor, setOnlyEditor] = useState<boolean>(false);
  const [onlyPreview, setOnlyPreview] = useState<boolean>(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  function handleEditorDidMount(editor, monaco) {
    monaco.languages.setLanguageConfiguration('markdown', {
      onEnterRules: [
        {
          beforeText: /^- \[([ x])] .*$/,
          action: {
            indentAction: monaco.languages.IndentAction.None,
            appendText: '- [ ] ',
          },
        },
        {
          beforeText: /^- .*$/,
          action: {
            indentAction: monaco.languages.IndentAction.None,
            appendText: '- ',
          },
        },
        {
          beforeText: /^\d*\. .*$/,
          action: {
            indentAction: monaco.languages.IndentAction.None,
            appendText: '1. ',
          },
        },
      ],
    });
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  document.onpaste = (evt) => {
    const dT = evt.clipboardData;
    const file = dT.files[0];
    console.log(file);
  };

  const Editor = {
    collapsible: true,
    content: (
      <QuietEditor
        value={value}
        paddingTop={16}
        paddingBottom={16}
        lineNumbers={'off'}
        language={'markdown'}
        minimapEnabled={false}
        lineDecorationsWidth={0}
        onMount={handleEditorDidMount}
        onChange={(val) => {
          setValue(val);
          if (props.onChange) {
            props.onChange(val);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 0,
          borderWidth: 0,
        }}
      />
    ),
  };

  const Preview = {
    collapsible: true,
    content: <QuietMarkdownViewer value={value} />,
  };

  function getPanes() {
    const panes = [];
    if (!onlyPreview) {
      panes.push(Editor);
    }
    if (!onlyEditor) {
      panes.push(Preview);
    }
    return panes;
  }

  return (
    <Card
      bordered
      style={
        isFullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: zIndex,
              height: '100vh!important',
            }
          : {}
      }
      bodyStyle={{ padding: 0 }}
      className={styles[`quiet-markdown`]}
      title={
        <Toolbar
          editorRef={editorRef}
          monacoRef={monacoRef}
          tooltipZIndex={zIndex + 1}
        />
      }
      extra={
        <Space align="center" size={3}>
          <Tooltip mini style={{ zIndex: zIndex }} content={'仅编辑区'}>
            <Option
              onClick={() => {
                setOnlyEditor(!onlyEditor);
                setOnlyPreview(false);
              }}
            >
              <IconLeftExpand />
            </Option>
          </Tooltip>
          <Tooltip mini style={{ zIndex: zIndex }} content={'仅预览区'}>
            <Option
              onClick={() => {
                setOnlyPreview(!onlyPreview);
                setOnlyEditor(false);
              }}
            >
              <IconRightExpand />
            </Option>
          </Tooltip>
          <Tooltip
            mini
            style={{ zIndex: zIndex }}
            popupVisible={fsTtVisible}
            content={isFullscreen ? '退出全屏' : '网页全屏'}
          >
            <Option
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setFsTtVisible(!fsTtVisible);
              }}
              onMouseEnter={() => setFsTtVisible(true)}
              onMouseLeave={() => setFsTtVisible(false)}
            >
              {isFullscreen ? <IconFullscreenExit /> : <IconFullscreen />}
            </Option>
          </Tooltip>
        </Space>
      }
      headerStyle={{
        height: 'auto',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'rgb(var(--gray-2))',
        borderBottom: '1px solid var(--color-neutral-3)',
      }}
    >
      <ResizeBox.SplitGroup
        direction={'horizontal'}
        style={{ height: isFullscreen ? '100vh' : height }}
        panes={getPanes()}
      />
    </Card>
  );
}

export default QuietMarkdown;
