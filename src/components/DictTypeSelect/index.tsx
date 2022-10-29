import React from 'react';
import DebounceSelect from '@/components/DebounceSelect';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { findEnabledDictType } from '@/service/system/quiet-dict-type';

export function DictTypeSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      value?: string;
      debounceTimeout?: number;
    }
) {
  function fetchOptions(name: string, ids?: string[]) {
    return findEnabledDictType(name, ids).then((resp) => {
      return resp.map((dictType) => ({
        key: dictType.id,
        label: dictType.name,
        value: dictType.id,
      }));
    });
  }

  function getOptionsByValues(values: string[]) {
    return fetchOptions('', values);
  }

  function getOptionsByInputValue(inputValue: string) {
    return fetchOptions(inputValue);
  }

  return (
    <DebounceSelect
      getOptionsByValues={getOptionsByValues}
      getOptionsByInputValue={getOptionsByInputValue}
      {...props}
    />
  );
}

export default DictTypeSelect;
