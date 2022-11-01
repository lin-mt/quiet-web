import React, { useContext, useEffect, useState } from 'react';
import { Property } from 'csstype';
import {
  Button,
  Grid,
  Input,
  Popconfirm,
  Space,
  Tooltip,
} from '@arco-design/web-react';
import { IconBgColors } from '@arco-design/web-react/icon';
import { HexColorPicker } from 'react-colorful';
import { getPresetColors } from '@arco-design/color';
import './style/style.css';
import { GlobalContext } from '@/context';

const { Row, Col } = Grid;

export type ColorPickerProps = {
  value?: Property.BackgroundColor;
  onChange?: (value: Property.BackgroundColor) => void;
};

function ColorPicker(props: ColorPickerProps) {
  const { value, onChange } = props;
  const [color, setColor] = useState<Property.BackgroundColor>();
  const [hcpColor, setHcpColor] = useState<Property.BackgroundColor>();
  const [presetColors] = useState(getPresetColors());
  const { theme } = useContext(GlobalContext);
  const hexReg = /^#([0-9A-F]{6}|[A-Fa-f0-9]{3})$/i;
  const arcoReg = new RegExp(
    'rgb\\(var\\(--(red|orangered|orange|gold|yellow|lime|green|cyan|blue|arcoblue|purple|pinkpurple|magenta)-([1-9]|10)\\)\\)',
    ''
  );

  useEffect(() => {
    if (value) {
      if (hexReg.test(value)) {
        setHcpColor(value);
        setColor(value);
      }
      if (arcoReg.test(value)) {
        const matchArray = value.match(arcoReg);
        const hexColor = presetColors[matchArray[1]][theme][matchArray[2]];
        setHcpColor(hexColor);
        setColor(hexColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, value]);

  function handleColorChange(value) {
    if (hexReg.test(value)) {
      setColor(value);
      if (onChange) {
        onChange(value);
      }
    }
  }

  function buildContent() {
    return (
      <div className={'content'}>
        <HexColorPicker
          color={hcpColor}
          style={{ width: '100%' }}
          onChange={(value) => {
            setColor(value);
            setHcpColor(value);
          }}
        />
        <Space direction={'vertical'} size={3}>
          <div style={{ fontSize: 12, color: 'var(--color-text-2)' }}>
            自适应色板，适配亮色 / 暗黑模式
          </div>
          <Row>
            {Object.keys(presetColors).map((key) => {
              return (
                <Col key={key} span={3}>
                  <Tooltip
                    color={'var(--color-bg-popup)'}
                    content={
                      <>
                        {Object.keys(presetColors[key].light).map((i) => {
                          const bgc = `rgb(var(--${key}-${Number(i) + 1}))`;
                          const hexColor =
                            theme === 'light'
                              ? presetColors[key].light[i]
                              : presetColors[key].dark[i];
                          return (
                            <div
                              key={i}
                              style={{
                                height: 20,
                                width: 100,
                                marginBottom: 3,
                                cursor: 'pointer',
                                backgroundColor: bgc,
                              }}
                              onClick={() => {
                                setColor(hexColor);
                                setHcpColor(hexColor);
                                if (onChange) {
                                  onChange(bgc);
                                }
                              }}
                            />
                          );
                        })}
                      </>
                    }
                  >
                    <div
                      style={{
                        width: 13,
                        height: 13,
                        marginBottom: 5,
                        cursor: 'pointer',
                        backgroundColor: presetColors[key].primary,
                      }}
                    />
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
          <Row gutter={10}>
            <Col span={17}>
              <Input value={color} size={'mini'} onChange={handleColorChange} />
            </Col>
            <Col span={7}>
              <div
                style={{
                  height: 24,
                  width: '100%',
                  backgroundColor: color,
                  display: 'inline-block',
                  float: 'left',
                  borderRadius: 'var(--border-radius-small)',
                }}
              />
            </Col>
          </Row>
        </Space>
      </div>
    );
  }

  return (
    <Popconfirm className={'color-picker'} icon={null} title={buildContent()}>
      <Button icon={<IconBgColors />} style={{ color }} />
    </Popconfirm>
  );
}

export default ColorPicker;
