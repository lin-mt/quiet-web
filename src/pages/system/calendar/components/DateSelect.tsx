import React, { useEffect, useState } from 'react';
import { Button, Col, Popover, Row } from 'antd';
import type { QuietHoliday } from '@/services/system/EntityType';
import moment from 'moment';
import { updateHoliday } from '@/services/system/QuietHoliday';
import _ from 'lodash';

type HolidayDateProps = {
  holidayInfo: QuietHoliday;
  workingColor?: string;
  holidayColor?: string;
  afterUpdate?: () => void;
};

const HolidayDate: React.FC<HolidayDateProps> = (props: HolidayDateProps) => {
  const [holidayInfo, setHolidayInfo] = useState<QuietHoliday>(props.holidayInfo);

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
      if (props.afterUpdate) {
        props.afterUpdate();
      }
    });
  }

  return (
    <Popover
      trigger={'hover'}
      content={
        <Row gutter={10}>
          <Col>
            <Button type={'primary'} size={'small'} onClick={() => setHoliday(true)}>
              设为休息日
            </Button>
          </Col>
          <Col>
            <Button type={'primary'} size={'small'} onClick={() => setHoliday(false)}>
              设为工作日
            </Button>
          </Col>
        </Row>
      }
    >
      <div style={{ paddingLeft: 3, paddingRight: 3 }}>
        <div
          style={{
            backgroundColor: props.holidayInfo?.is_holiday
              ? props.holidayColor
              : props.workingColor,
          }}
        >
          {moment(props.holidayInfo?.date_info).format('DD')}
        </div>
      </div>
    </Popover>
  );
};

export default HolidayDate;
