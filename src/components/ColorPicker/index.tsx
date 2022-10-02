import React, { useEffect, useState } from 'react';
import { Property } from 'csstype';
import { Button, Grid, Input, Popconfirm } from '@arco-design/web-react';
import { IconBgColors } from '@arco-design/web-react/icon';
import { HexColorPicker } from 'react-colorful';
import './style/style.css';

export type ColorPickerProps = {
  value?: Property.BackgroundColor;
  onChange?: (value: Property.BackgroundColor) => void;
};

function ColorPicker(props: ColorPickerProps) {
  const [color, setColor] = useState<Property.BackgroundColor>('#3491FA');

  useEffect(() => {
    if (props.value) {
      setColor(props.value);
    }
  }, [props.value]);

  function handleColorChange(value) {
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setColor(value);
      if (props.onChange) {
        props.onChange(value);
      }
    }
  }

  function buildContent() {
    return (
      <div className={'content'}>
        <HexColorPicker
          color={color}
          onChange={handleColorChange}
          style={{ width: '100%' }}
        />
        <Grid.Row gutter={10} align={'center'}>
          <Grid.Col flex={'auto'}>HEX</Grid.Col>
          <Grid.Col flex={'auto'}>
            <Input
              value={color}
              size={'mini'}
              onChange={handleColorChange}
              style={{ width: 110 }}
            />
          </Grid.Col>
          <Grid.Col flex={'auto'}>
            <div
              style={{
                height: 24,
                width: 48,
                backgroundColor: color,
                display: 'inline-block',
                float: 'left',
                borderRadius: 'var(--border-radius-small)',
              }}
            />
          </Grid.Col>
        </Grid.Row>
      </div>
    );
  }

  return (
    <Popconfirm className={'color-picker'} icon={null} title={buildContent()}>
      <Button icon={<IconBgColors />} style={{ color }} />{' '}
    </Popconfirm>
  );
}

export default ColorPicker;
