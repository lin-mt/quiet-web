import React from 'react';
import { Dropdown, Menu, Space, Tooltip, Upload } from '@arco-design/web-react';
import {
  IconBold,
  IconBranch,
  IconCheckSquare,
  IconCode,
  IconCodeBlock,
  IconFormula,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconImage,
  IconItalic,
  IconLink,
  IconOrderedList,
  IconQuote,
  IconStrikethrough,
  IconUnorderedList,
} from '@arco-design/web-react/icon';
import {
  IconBlockFormula,
  IconInlineFormula,
  IconInsertTable,
  IconScale,
  IconSubscript,
  IconSuperscript,
  IconTitleLevel,
} from '@/components/icon';
import styles from '@/components/QuietMarkdown/style/index.module.less';
import { MermaidDefaults } from '@/components/QuietMarkdown/mermaid';
import { Option } from '@/components/QuietMarkdown/index';
import { RequestOptions } from '@arco-design/web-react/es/Upload/interface';
import req from '@/utils/request';
import { UploadResult } from '@/service/system/type';

export type ToolbarProp = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef: React.MutableRefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monacoRef: React.MutableRefObject<any>;
  tooltipZIndex: number;
};

function Toolbar(props: ToolbarProp) {
  const { editorRef, tooltipZIndex } = props;

  function setEditorValue(
    range: {
      startLineNumber: number;
      endLineNumber: number;
      startColumn: number;
      endColumn: number;
    },
    text: string
  ) {
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: range,
          text: text,
        },
      ],
      () => []
    );
  }

  function setEditorFocusPosition(lineNumber: number, column: number) {
    editorRef.current.setPosition({
      lineNumber,
      column,
    });
    editorRef.current.focus();
  }

  function changeHeading(level: number) {
    const headingStar = '#'.repeat(level) + ' ';
    const headingRegex = new RegExp('^#{1,7} ', '');
    const position = editorRef.current.getPosition();
    const linePos = position.lineNumber;
    const value = editorRef.current.getModel().getLineContent(linePos);
    let newValue;
    const headingMatchArray = value.match(headingRegex);
    if (headingMatchArray?.length > 0) {
      newValue = value.replace(headingRegex, headingStar);
    } else {
      newValue = headingStar + value;
    }
    setEditorValue(
      {
        startLineNumber: linePos,
        endLineNumber: linePos,
        startColumn: 1,
        endColumn: value.length + 1,
      },
      newValue
    );
    setEditorFocusPosition(linePos, newValue.length + 1);
  }

  function setStartAndEndCharacters(
    start: string,
    end: string,
    cursorColumnAdd = 0
  ) {
    const selection = editorRef.current.getSelection();
    const selectVal = editorRef.current.getModel().getValueInRange(selection);
    setEditorValue(selection, start + selectVal + end);
    setEditorFocusPosition(
      selection.endLineNumber,
      selection.endColumn +
        (selection.startLineNumber != selection.endLineNumber
          ? 0
          : start.length + cursorColumnAdd)
    );
  }

  function addCharactersAtLineStart(characters: string) {
    const position = editorRef.current.getPosition();
    const linePos = position.lineNumber;
    const value = editorRef.current.getModel().getLineContent(linePos);
    const newValue = characters + value;
    setEditorValue(
      {
        startLineNumber: linePos,
        endLineNumber: linePos,
        startColumn: 1,
        endColumn: value.length + 1,
      },
      newValue
    );
    setEditorFocusPosition(linePos, newValue.length + 1);
  }

  function addBlockValue(
    blockValue: string,
    newColumnPos: number,
    newLineNum = 0
  ) {
    const position = editorRef.current.getPosition();
    const linePos = position.lineNumber;
    let newValue = blockValue;
    const lineValue = editorRef.current.getModel().getLineContent(linePos);
    let addLineNumber = linePos;
    if (lineValue.length !== 0) {
      newValue = '\n' + newValue;
      addLineNumber = addLineNumber + 1;
    }
    setEditorValue(
      {
        startLineNumber: addLineNumber,
        endLineNumber: addLineNumber,
        startColumn: 1,
        endColumn: 1,
      },
      newValue
    );
    setEditorFocusPosition(addLineNumber + newLineNum, newColumnPos);
  }

  const FormulaList = (
    <Menu className={styles['dropdown']}>
      <Menu.Item
        key="inlineFormula"
        onClick={() => setStartAndEndCharacters('$', '$')}
      >
        <IconInlineFormula /> 行内公式
      </Menu.Item>
      <Menu.Item
        key="blockFormula"
        onClick={() => addBlockValue('$$\n' + '\\TeX\n' + '$$\n', 3)}
      >
        <IconBlockFormula /> 块级公式
      </Menu.Item>
    </Menu>
  );

  const MermaidList = (
    <Menu className={styles['dropdown']}>
      <Menu.ItemGroup title="mermaid 图表">
        {Object.keys(MermaidDefaults).map((key) => {
          return (
            <Menu.Item
              key={key}
              onClick={() =>
                addBlockValue(
                  MermaidDefaults[key].value,
                  MermaidDefaults[key].newColumnPos,
                  MermaidDefaults[key].newLineNum
                )
              }
            >
              {MermaidDefaults[key].name}
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
    </Menu>
  );

  const headingList = (
    <Menu className={styles['dropdown']}>
      <Menu.Item key="1" onClick={() => changeHeading(1)}>
        <IconH1 /> 一级标题
      </Menu.Item>
      <Menu.Item key="2" onClick={() => changeHeading(2)}>
        <IconH2 /> 二级标题
      </Menu.Item>
      <Menu.Item key="3" onClick={() => changeHeading(3)}>
        <IconH3 /> 三级标题
      </Menu.Item>
      <Menu.Item key="4" onClick={() => changeHeading(4)}>
        <IconH4 /> 四级标题
      </Menu.Item>
      <Menu.Item key="5" onClick={() => changeHeading(5)}>
        <IconH5 /> 五级标题
      </Menu.Item>
      <Menu.Item key="6" onClick={() => changeHeading(6)}>
        <IconH6 /> 六级标题
      </Menu.Item>
    </Menu>
  );

  const ImageScale: number[] = [30, 50, 70, 100];

  function handleImageScaling(value: number) {
    const position = editorRef.current.getPosition();
    const linePos = position.lineNumber;
    const lineContent = editorRef.current.getModel().getLineContent(linePos);
    const markdownPattern = /!\[(.*?)]\((.*?)\)/gm;
    const htmlPattern = /<img([^>]*)(width="([1-9][0-9]*)%")([^>]*) +\/>/gm;
    let matcher: RegExpExecArray;
    let appendPos = 0;
    let matched = false;
    while ((matcher = htmlPattern.exec(lineContent)) !== null) {
      matched = true;
      const startColumn = matcher.index + 1 + appendPos;
      const endColumn = startColumn + matcher[0].length;
      const newText = matcher[0].replace(matcher[2], `width="${value}%"`);
      setEditorValue(
        {
          startLineNumber: linePos,
          endLineNumber: linePos,
          startColumn: startColumn,
          endColumn: endColumn,
        },
        newText
      );
      appendPos += newText.length - matcher[0].length;
    }
    appendPos = 0;
    while ((matcher = markdownPattern.exec(lineContent)) !== null) {
      matched = true;
      const startColumn = matcher.index + 1 + appendPos;
      const endColumn = startColumn + matcher[0].length;
      const newText = `<img src="${matcher[2]}" alt="${matcher[1]}" width="${value}%" />`;
      setEditorValue(
        {
          startLineNumber: linePos,
          endLineNumber: linePos,
          startColumn: startColumn,
          endColumn: endColumn,
        },
        newText
      );
      appendPos += newText.length - matcher[0].length;
    }
    if (!matched) {
      setEditorValue(position, `<img src="" alt="" width="${value}%" />`);
      setEditorFocusPosition(position.endLineNumber, position.endColumn + 10);
    }
  }

  const ScaleList = (
    <Menu className={styles['dropdown']}>
      <Menu.ItemGroup title="图片缩放">
        {ImageScale.map((value) => (
          <Menu.Item key={`${value}`} onClick={() => handleImageScaling(value)}>
            {value}%
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  function handleUploadImage(options: RequestOptions) {
    const data = new FormData();
    data.append('files', options.file);
    data.append('classification', 'doc/api/remark');
    req(`/minio`, {
      method: 'POST',
      data,
    }).then((resp) => {
      const result: UploadResult[] = resp.data;
      result.every((value) => {
        setStartAndEndCharacters(
          `![${value.user_metadata.original_file_name}](${value.view_path})`,
          ''
        );
      });
    });
  }

  return (
    <Space align="center" size={3}>
      <Dropdown
        droplist={headingList}
        triggerProps={{ style: { zIndex: tooltipZIndex } }}
      >
        <Option>
          <IconTitleLevel />
        </Option>
      </Dropdown>
      <Tooltip mini content={'粗体'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('**', '**')}>
          <IconBold />
        </Option>
      </Tooltip>
      <Tooltip mini content={'斜体'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('*', '*')}>
          <IconItalic />
        </Option>
      </Tooltip>
      <Tooltip mini content={'下标'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('<sub>', '</sub>')}>
          <IconSubscript />
        </Option>
      </Tooltip>
      <Tooltip mini content={'上标'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('<sup>', '</sup>')}>
          <IconSuperscript />
        </Option>
      </Tooltip>
      <Tooltip mini content={'引用'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => addCharactersAtLineStart('> ')}>
          <IconQuote />
        </Option>
      </Tooltip>
      <Tooltip mini content={'链接'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('[', ']()', 2)}>
          <IconLink />
        </Option>
      </Tooltip>
      <Tooltip mini content={'图片'} style={{ zIndex: tooltipZIndex }}>
        <Upload
          accept={'image/*'}
          customRequest={handleUploadImage}
          renderUploadList={() => <></>}
          renderUploadItem={() => <></>}
        >
          <Option>
            <IconImage />
          </Option>
        </Upload>
      </Tooltip>
      <Dropdown
        droplist={ScaleList}
        triggerProps={{ style: { zIndex: tooltipZIndex } }}
      >
        <Option>
          <IconScale />
        </Option>
      </Dropdown>
      <Tooltip mini content={'代码'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('`', '`')}>
          <IconCode />
        </Option>
      </Tooltip>
      <Tooltip mini content={'代码块'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => addBlockValue('```\r\n```', 4)}>
          <IconCodeBlock />
        </Option>
      </Tooltip>
      <Tooltip mini content={'无序列表'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => addCharactersAtLineStart('- ')}>
          <IconUnorderedList />
        </Option>
      </Tooltip>
      <Tooltip mini content={'有序列表'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => addCharactersAtLineStart('1. ')}>
          <IconOrderedList />
        </Option>
      </Tooltip>
      <Tooltip mini content={'删除线'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => setStartAndEndCharacters('~~', '~~')}>
          <IconStrikethrough />
        </Option>
      </Tooltip>
      <Tooltip mini content={'任务列表'} style={{ zIndex: tooltipZIndex }}>
        <Option onClick={() => addCharactersAtLineStart('- [ ] ')}>
          <IconCheckSquare />
        </Option>
      </Tooltip>
      <Tooltip mini content={'表格'} style={{ zIndex: tooltipZIndex }}>
        <Option
          onClick={() =>
            addBlockValue(
              '| Heading |  |\n' + '| --- | --- |\n' + '|  |  |\n',
              10
            )
          }
        >
          <IconInsertTable />
        </Option>
      </Tooltip>
      <Dropdown
        droplist={FormulaList}
        triggerProps={{ style: { zIndex: tooltipZIndex } }}
      >
        <Option>
          <IconFormula />
        </Option>
      </Dropdown>
      <Dropdown
        droplist={MermaidList}
        triggerProps={{ style: { zIndex: tooltipZIndex } }}
      >
        <Option>
          <IconBranch />
        </Option>
      </Dropdown>
    </Space>
  );
}

export default Toolbar;
