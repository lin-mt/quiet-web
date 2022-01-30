import { Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

export const tagColor = '#108EE9';
export const filterStyle = {
  backgroundColor: '#f1f4f5',
};

export function multipleSelectTagRender(tagProps: CustomTagProps) {
  const { label, closable, onClose } = tagProps;
  return (
    <Tag color={tagColor} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
}
