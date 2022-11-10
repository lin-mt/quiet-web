import React from 'react';
import { Divider, Dropdown, Space, Tooltip } from '@arco-design/web-react';
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
  IconSubscript,
  IconSuperscript,
} from '@/components/icon';
import styled from 'styled-components';

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

const DropdownOption = styled.div`
  background-color: rgb(var(--gray-2));
  border-radius: var(--border-radius-small);
  color: var(--color-text-1);
  padding: 0 8px;
  line-height: 26px;
  height: 26px;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;

  :hover {
    background-color: rgb(var(--gray-3));
  }
`;

const DropdownContainer = styled(Space)`
  margin-top: 3px;
  padding-top: 3px;
  padding-bottom: 3px;
  font-size: 13px;
  background-color: rgb(var(--gray-2));
  border: 1px solid var(--color-border);
`;

export type ToolbarProp = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef: React.MutableRefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monacoRef: React.MutableRefObject<any>;
  tooltipZIndex: number;
};

function Toolbar(props: ToolbarProp) {
  const { editorRef, tooltipZIndex } = props;

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
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: {
            startLineNumber: linePos,
            endLineNumber: linePos,
            startColumn: 1,
            endColumn: value.length + 1,
          },
          text: newValue,
        },
      ],
      () => []
    );
    editorRef.current.setPosition({
      lineNumber: linePos,
      column: newValue.length + 1,
    });
    editorRef.current.focus();
  }

  function setStartAndEndCharacters(
    start: string,
    end: string,
    cursorColumnAdd = 0
  ) {
    const selection = editorRef.current.getSelection();
    const selectVal = editorRef.current.getModel().getValueInRange(selection);
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: selection,
          text: start + selectVal + end,
        },
      ],
      () => []
    );
    editorRef.current.setPosition({
      lineNumber: selection.endLineNumber,
      column:
        selection.endColumn +
        (selection.startLineNumber != selection.endLineNumber
          ? 0
          : start.length + cursorColumnAdd),
    });
    editorRef.current.focus();
  }

  function addCharactersAtLineStart(characters: string) {
    const position = editorRef.current.getPosition();
    const linePos = position.lineNumber;
    const value = editorRef.current.getModel().getLineContent(linePos);
    const newValue = characters + value;
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: {
            startLineNumber: linePos,
            endLineNumber: linePos,
            startColumn: 1,
            endColumn: value.length + 1,
          },
          text: newValue,
        },
      ],
      () => []
    );
    editorRef.current.setPosition({
      lineNumber: linePos,
      column: newValue.length + 1,
    });
    editorRef.current.focus();
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
    let next = 0;
    if (lineValue.length !== 0) {
      newValue = '\r\n' + newValue;
      next = 1;
    } else {
      let preLineNoContent = position.lineNumber === 1;
      if (!preLineNoContent) {
        preLineNoContent =
          editorRef.current.getModel().getLineContent(position.lineNumber - 1)
            .length === 0;
      }
      if (!preLineNoContent) {
        newValue = '\r\n' + newValue;
      }
    }
    const addLineNumber = linePos + next;
    editorRef.current.getModel().pushEditOperations(
      [],
      [
        {
          forceMoveMarkers: true,
          range: {
            startLineNumber: addLineNumber,
            endLineNumber: addLineNumber,
            startColumn: 1,
            endColumn: 1,
          },
          text: newValue,
        },
      ],
      () => []
    );
    editorRef.current.setPosition({
      lineNumber:
        addLineNumber + (newValue.startsWith('\r\n') ? 1 : 0) + newLineNum,
      column: newColumnPos,
    });
    editorRef.current.focus();
  }

  const HeadingList = (
    <DropdownContainer direction={'vertical'} size={3}>
      <DropdownOption onClick={() => changeHeading(1)}>
        <IconH1 /> 一级标题
      </DropdownOption>
      <DropdownOption onClick={() => changeHeading(2)}>
        <IconH2 /> 二级标题
      </DropdownOption>
      <DropdownOption onClick={() => changeHeading(3)}>
        <IconH3 /> 三级标题
      </DropdownOption>
      <DropdownOption onClick={() => changeHeading(4)}>
        <IconH4 /> 四级标题
      </DropdownOption>
      <DropdownOption onClick={() => changeHeading(5)}>
        <IconH5 /> 五级标题
      </DropdownOption>
      <DropdownOption onClick={() => changeHeading(6)}>
        <IconH6 /> 六级标题
      </DropdownOption>
    </DropdownContainer>
  );

  const FormulaList = (
    <DropdownContainer direction={'vertical'} size={3}>
      <DropdownOption onClick={() => setStartAndEndCharacters('$', '$')}>
        <IconInlineFormula /> 行内公式
      </DropdownOption>
      <DropdownOption
        onClick={() => addBlockValue('$$\n' + '\\TeX\n' + '$$\n', 3)}
      >
        <IconBlockFormula /> 块级公式
      </DropdownOption>
    </DropdownContainer>
  );

  const MermaidList = (
    <DropdownContainer direction={'vertical'} size={3}>
      <div style={{ marginLeft: 5, marginRight: 5 }}>Mermaid 图表</div>
      <Divider style={{ marginTop: 2, marginBottom: 2 }} />
      <DropdownOption>类图</DropdownOption>
      <DropdownOption>流程图</DropdownOption>
      <DropdownOption>时序图</DropdownOption>
      <DropdownOption>状态图</DropdownOption>
      <DropdownOption>关系图</DropdownOption>
      <DropdownOption>旅程图</DropdownOption>
      <DropdownOption>甘特图</DropdownOption>
      <DropdownOption>饼状图</DropdownOption>
    </DropdownContainer>
  );

  return (
    <Space align="center" size={3}>
      <Dropdown droplist={HeadingList}>
        <Option>H</Option>
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
      <Tooltip mini content={'暂不支持'} style={{ zIndex: tooltipZIndex }}>
        <Option>
          <IconImage />
        </Option>
      </Tooltip>
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
      <Dropdown droplist={FormulaList}>
        <Option style={{ zIndex: tooltipZIndex }}>
          <IconFormula />
        </Option>
      </Dropdown>
      <Tooltip mini content={'暂不支持'} style={{ zIndex: tooltipZIndex }}>
        <Dropdown droplist={MermaidList} disabled>
          <Option>
            <IconBranch />
          </Option>
        </Dropdown>
      </Tooltip>
    </Space>
  );
}

export default Toolbar;
