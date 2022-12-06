import React from 'react';

import Subscript from './subscript-solid.svg';
import Superscript from './superscript-solid.svg';
import InlineFormula from './inline-formula.svg';
import BlockFormula from './block-formula.svg';
import Table from './table.svg';
import InsertTable from './insert-table.svg';
import LeftExpand from './left-expand.svg';
import RightExpand from './right-expand.svg';

interface IconProps extends React.SVGAttributes<SVGElement> {
  style?: React.CSSProperties;
}

export class IconSubscript extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <Subscript
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconInlineFormula extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <InlineFormula
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconBlockFormula extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <BlockFormula
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconSuperscript extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <Superscript
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconTable extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <Table
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconInsertTable extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <InsertTable
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconLeftExpand extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <LeftExpand
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}

export class IconRightExpand extends React.Component<
  IconProps & React.RefAttributes<unknown>
> {
  render() {
    const className = this.props.className;
    return (
      <RightExpand
        {...this.props}
        className={`arco-icon ${className ? className : ''}`}
      />
    );
  }
}
