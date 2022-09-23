import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { QuietHoliday } from '@/service/system/type';
import { listHoliday } from '@/service/system/quiet-holiday';
import { Calendar, Card, Form, Grid, Select } from '@arco-design/web-react';
import DateSetting from '@/pages/system/calendar-setting/date-setting';
import dayjs, { Dayjs } from 'dayjs';

const { Row, Col } = Grid;

export default () => {
  const nowYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(nowYear);
  const [holidays, setHolidays] = useState<Record<string, QuietHoliday>>({});

  const holidayColor = 'rgb(var(--arcoblue-2))';
  const workingColor = 'rgb(var(--orange-3))';
  const months: Dayjs[] = [];
  for (let i = 1; i <= 12; i++) {
    const month = i < 10 ? '0' + i : i;
    months.push(dayjs(selectedYear + '-' + month + '-01'));
  }

  const loadYearHoliday = useCallback(() => {
    listHoliday(selectedYear).then((resp) => {
      const yearAll: Record<string, QuietHoliday> = {};
      for (const holiday of resp) {
        yearAll[holiday.date_info] = holiday;
      }
      setHolidays(yearAll);
    });
  }, [selectedYear]);

  useEffect(() => {
    loadYearHoliday();
  }, [loadYearHoliday]);

  return (
    <Card>
      <Row gutter={20}>
        <Col span={4}>
          <Form.Item label={'年份'}>
            <Select
              defaultValue={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              options={[
                { value: nowYear - 1, label: nowYear - 1 },
                { value: nowYear, label: nowYear },
                { value: nowYear + 1, label: nowYear + 1 },
                { value: nowYear + 2, label: nowYear + 2 },
                { value: nowYear + 3, label: nowYear + 3 },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Row>
            <Col span={12}>
              <Form.Item
                label={'工作日'}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                <div
                  style={{
                    width: 45,
                    height: 22,
                    backgroundColor: workingColor,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'休息日'}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                <div
                  style={{
                    width: 45,
                    height: 22,
                    backgroundColor: holidayColor,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={20}>
        {months.map((value) => {
          return (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              xxl={6}
              key={value.format('YYYY-MM')}
              style={{ marginBottom: 15 }}
            >
              <Calendar
                panel
                panelWidth={'100%'}
                defaultValue={value.format('YYYY-MM') + '-01'}
                headerRender={() => (
                  <div
                    style={{
                      textAlign: 'center',
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontStyle: '14px',
                    }}
                  >
                    {value.format('YYYY-MM')}
                  </div>
                )}
                dateRender={(date) => {
                  return (
                    <DateSetting
                      holidayColor={holidayColor}
                      disable={
                        date.format('YYYY-MM') !== value.format('YYYY-MM')
                      }
                      date={date}
                      workingColor={workingColor}
                      afterSetHoliday={() => loadYearHoliday()}
                      holidayInfo={holidays[date.format('YYYY-MM-DD')]}
                    />
                  );
                }}
              />
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};
