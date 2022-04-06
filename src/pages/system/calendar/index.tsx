import { PageContainer } from '@ant-design/pro-layout';
import { Calendar, Card, Col, Form, Row, Select } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { listHoliday } from '@/services/system/QuietHoliday';
import HolidayDate from '@/pages/system/calendar/components/DateSelect';
import type { QuietHoliday } from '@/services/system/EntityType';

export default () => {
  const nowYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(nowYear);
  const [holidays, setHolidays] = useState<Record<string, QuietHoliday>>({});

  const holidayColor = '#AFF0B5';
  const workingColor = '#e5e6eb';
  const months: Moment[] = [];
  for (let i = 1; i <= 12; i++) {
    const month = i < 10 ? '0' + i : i;
    const momentMonth = moment(selectedYear + '-' + month + '-01');
    months.push(momentMonth);
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
    <PageContainer style={{ backgroundColor: 'white' }}>
      <Row gutter={20}>
        <Col>
          <Form.Item label={'年份'}>
            <Select
              defaultValue={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              options={[
                { value: nowYear - 1 },
                { value: nowYear },
                { value: nowYear + 1 },
                { value: nowYear + 2 },
                { value: nowYear + 3 },
              ]}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={'工作日'}>
            <div style={{ width: 45, height: 22, backgroundColor: workingColor }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={'休息日'}>
            <div style={{ width: 45, height: 22, backgroundColor: holidayColor }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        {months.map((value) => {
          return (
            <Col span={6} key={value.format('YYYY-MM')} style={{ marginBottom: 15 }}>
              <Card hoverable={true} bodyStyle={{ padding: 3 }}>
                <Calendar
                  style={{ borderRadius: 6 }}
                  fullscreen={false}
                  disabledDate={(date) => date.format('YYYY-MM') !== value.format('YYYY-MM')}
                  value={moment(value.format('YYYY-MM') + '-01')}
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
                  dateFullCellRender={(date) => {
                    return (
                      <HolidayDate
                        holidayColor={holidayColor}
                        workingColor={workingColor}
                        afterUpdate={() => loadYearHoliday()}
                        holidayInfo={holidays[date.format('YYYY-MM-DD')]}
                      />
                    );
                  }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </PageContainer>
  );
};
