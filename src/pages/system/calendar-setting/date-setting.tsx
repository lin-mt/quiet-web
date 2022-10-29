import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { QuietHoliday } from '@/service/system/type';
import { updateHoliday } from '@/service/system/quiet-holiday';
import { Button, Grid, Popover } from '@arco-design/web-react';
import dayjs, { Dayjs } from 'dayjs';

const { Row, Col } = Grid;

type HolidayDateProps = {
  holidayInfo: QuietHoliday;
  date: Dayjs;
  disable?: boolean;
  workingColor?: string;
  holidayColor?: string;
  afterSetHoliday?: () => void;
};

const HolidayDate: React.FC<HolidayDateProps> = (props: HolidayDateProps) => {
  const [holidayInfo, setHolidayInfo] = useState<QuietHoliday>(
    props.holidayInfo
  );

  useEffect(() => {
    setHolidayInfo(props.holidayInfo);
  }, [props.holidayInfo]);

  function setHoliday(isHoliday: boolean) {
    if (holidayInfo.is_holiday === isHoliday) {
      return;
    }
    const quietHoliday = _.clone(holidayInfo);
    quietHoliday.is_holiday = isHoliday;
    updateHoliday(quietHoliday).then(() => {
      if (props.afterSetHoliday) {
        props.afterSetHoliday();
      }
    });
  }

  return (
    <Popover
      trigger={'hover'}
      disabled={props.disable}
      content={
        <Row gutter={10}>
          <Col span={12}>
            <Button
              type={'primary'}
              size={'small'}
              onClick={() => setHoliday(true)}
            >
              设为休息日
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type={'primary'}
              size={'small'}
              onClick={() => setHoliday(false)}
            >
              设为工作日
            </Button>
          </Col>
        </Row>
      }
    >
      <div
        style={{
          marginLeft: 3,
          marginRight: 3,
          borderRadius: 'var(--border-radius-small)',
          backgroundColor: props.disable
            ? 'var(--color-neutral-2)'
            : props.holidayInfo?.is_holiday
            ? props.holidayColor
            : props.workingColor,
        }}
      >
        <div style={{ cursor: props.disable ? '' : 'pointer' }}>
          {props.disable
            ? holidayInfo
              ? dayjs(holidayInfo.date_info).format('DD')
              : props.date.format('DD')
            : props.date.format('DD')}
        </div>
      </div>
    </Popover>
  );
};

export default HolidayDate;
