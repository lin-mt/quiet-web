import React from 'react';
import styles from '@/components/doc/style/index.module.less';

export const BlockTitle = (props) => {
  return (
    <div style={props.style} className={styles['block-title']}>
      {props.children}
    </div>
  );
};

export const SecondTitle = (props) => {
  return <div className={styles['second-title']}>{props.children}</div>;
};
