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
import { IconLeftExpand, IconRightExpand } from '@/components/icon';
import req from '@/utils/request';
import { UploadResult } from '@/service/system/type';

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
  const [isFocus, setIsFocus] = useState<boolean>(false);
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
    editor.onDidFocusEditorWidget(() => {
      setIsFocus(true);
    });
    editor.onDidBlurEditorWidget(() => {
      setIsFocus(false);
    });
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  document.onpaste = (event) => {
    if (!isFocus) {
      return;
    }
    const clipboardData = event.clipboardData;
    const file = clipboardData.files[0];
    if (file && file.type.startsWith('image/')) {
      const data = new FormData();
      data.append('files', file);
      data.append('classification', 'api/remark');
      req(`/doc/minio`, {
        method: 'POST',
        data,
      }).then((resp) => {
        const result: UploadResult[] = resp.data;
        result.every((value) => {
          addImage(value.user_metadata.original_file_name, value.view_path);
        });
      });
    }
  };

  function addImage(original_file_name: string, view_path: string) {
    const selection = editorRef.current.getSelection();
    const imageVal = `![${original_file_name}](${view_path})`;
    const newStartColumn = selection.startColumn - original_file_name.length;
    const newEndColumn = newStartColumn + imageVal.length;
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: {
            ...selection,
            startColumn: newStartColumn,
            endColumn: newEndColumn,
          },
          text: imageVal,
        },
      ],
      () => []
    );
    editorRef.current.setPosition({
      lineNumber: selection.endLineNumber,
      column: newEndColumn,
    });
    editorRef.current.focus();
  }

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
    content: (
      <div style={{ height: '100%', backgroundColor: 'var(--color-bg-3)' }}>
        <QuietMarkdownViewer value={value} />
      </div>
    ),
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
              border: 0,
              zIndex: zIndex,
              overflow: 'auto',
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
            <div
              className={styles['option']}
              onClick={() => {
                setOnlyEditor(!onlyEditor);
                setOnlyPreview(false);
              }}
            >
              <IconLeftExpand />
            </div>
          </Tooltip>
          <Tooltip mini style={{ zIndex: zIndex }} content={'仅预览区'}>
            <div
              className={styles['option']}
              onClick={() => {
                setOnlyPreview(!onlyPreview);
                setOnlyEditor(false);
              }}
            >
              <IconRightExpand />
            </div>
          </Tooltip>
          <Tooltip
            mini
            style={{ zIndex: zIndex }}
            popupVisible={fsTtVisible}
            content={isFullscreen ? '退出全屏' : '网页全屏'}
          >
            <div
              className={styles['option']}
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setFsTtVisible(!fsTtVisible);
              }}
              onMouseEnter={() => setFsTtVisible(true)}
              onMouseLeave={() => setFsTtVisible(false)}
            >
              {isFullscreen ? <IconFullscreenExit /> : <IconFullscreen />}
            </div>
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
        style={{ height: isFullscreen ? 'calc(100vh - 32px)' : height }}
        panes={getPanes()}
      />
    </Card>
  );
}

export default QuietMarkdown;
