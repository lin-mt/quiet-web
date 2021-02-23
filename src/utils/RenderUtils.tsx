import type { CustomTagProps } from 'rc-select/lib/interface/generator';
import { Tag } from 'antd';
import React from 'react';

export default function multipleSelectTagRender(tagProps: CustomTagProps) {
  const { label, closable, onClose } = tagProps;
  return (
    <Tag color={'#108EE9'} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
}
