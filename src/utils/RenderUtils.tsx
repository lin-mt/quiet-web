import type { CustomTagProps } from 'rc-select/lib/interface/generator';
import { Tag } from 'antd';

export const quietColor = '#108EE9';

export function multipleSelectTagRender(tagProps: CustomTagProps) {
  const { label, closable, onClose } = tagProps;
  return (
    <Tag color={quietColor} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
}
