import type { ChangeEvent, FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import React from 'react';

interface FieldInputProp {
  value: string;
  addonAfter?: React.ReactNode;
  onChange: (e: SyntheticEvent<HTMLInputElement>) => void;
}

export default (props: FieldInputProp) => {
  const [fieldValue, setFieldValue] = useState<string>(props.value);

  useEffect(() => {
    setFieldValue(props.value);
  }, [props.value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFieldValue(value);
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // @ts-ignore
      if (e.target.value !== props.value) return props.onChange(e);
    }
    return null;
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== props.value) return props.onChange(e);
    return null;
  };

  return (
    <Input
      addonAfter={props.addonAfter}
      value={fieldValue}
      onKeyUp={onKeyUp}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};
