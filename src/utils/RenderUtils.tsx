import type { CustomTagProps } from 'rc-select/lib/interface/generator';
import { Tag } from 'antd';
import React from 'react';

export const tagColor = '#108EE9';

export function multipleSelectTagRender(tagProps: CustomTagProps) {
  const { label, closable, onClose } = tagProps;
  return (
    <Tag color={tagColor} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
}

export function buildFullCard(
  cards: any[],
  num: number,
  addCard?: boolean,
  addCardKey?: string,
): any[] {
  let fullCard: React.SetStateAction<any[]> = [];
  if (addCard) {
    fullCard.push({ key: addCardKey });
  }
  fullCard = fullCard.concat(cards);
  const addEmptyCard = num - (fullCard.length % num);
  for (let i = 0; i < addEmptyCard; i += 1) {
    fullCard.push({ key: `empty${i}` });
  }
  return fullCard;
}
