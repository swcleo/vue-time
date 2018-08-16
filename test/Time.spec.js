const Time = require('../src/Time');

test('transformTimestampToStr()', () => {
  const t = new Time()
  t.tz('Asia/Taipei')
  expect(t.transformTimestampToStr(1534382333)).toBe('2018-08-16T09:18:53+08:00')
  t.tz('America/New_York')
  expect(t.transformTimestampToStr(1534382333)).toBe('2018-08-15T21:18:53-04:00')
  expect(t.transformTimestampToStr(1534382333, 'YYYY/MM/DD HH:mm:ss')).toBe('2018/08/15 21:18:53')
})


test('transformStrToTimestamp', () => {
  const t = new Time()
  t.tz('Asia/Taipei')
  expect(t.transformStrToTimestamp('2018/08/16 09:18:53', 'YYYY/MM/DD HH:mm:ss')).toBe(1534382333)
})
