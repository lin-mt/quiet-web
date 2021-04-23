import React, { useState } from 'react';
import { ProFormColorPicker } from '@ant-design/pro-form';
import debounce from 'lodash/debounce';

type ColorPickerProps = {
  initialValue?: string;
  debounceTimeout?: number;
  onChange: (color: any) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { initialValue, debounceTimeout = 1500, onChange } = props;

  const [fieldValue, setFieldValue] = useState<string | undefined>(
    initialValue === null ? undefined : initialValue,
  );
  const fetchRef = React.useRef(0);

  const debounceInvokeOnChange = React.useMemo(() => {
    const invokeOnChange = (color: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      if (fetchId !== fetchRef.current) {
        // for fetch callback order
        return;
      }
      onChange(color);
    };

    return debounce(invokeOnChange, debounceTimeout);
  }, [onChange, debounceTimeout]);

  return (
    <div style={{ height: '32px' }}>
      <ProFormColorPicker
        fieldProps={{
          value: fieldValue,
          onChange: (color: any) => {
            setFieldValue(color);
            debounceInvokeOnChange(color);
          },
        }}
      />
    </div>
  );
};

export default ColorPicker;
