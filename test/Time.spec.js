const Time = require('../src/Time');


// 注意 transformTimestampToStr & transformStrToTimestamp
// 原本走tz會受冬季節約時間影響，改用utcOffset是透過運算調整
test('xxx', () => {
  const t = new Time()
  t.utcOffset(-240)
  t.update('1542589200')
  expect(t.format()).toBe('2018-11-18T21:00:00-04:00')
  expect(t.transformTimestampToStr('1542589200', 'YYYY/MM/DD HH:mm:ss')).toBe('2018/11/18 21:00:00')
  expect(t.transformStrToTimestamp('2018/11/18 21:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542589200)
})

test('transformTimestampToStr()', () => {
  const t = new Time()
  t.tz('Asia/Taipei')
  expect(t.transformTimestampToStr(1534382333)).toBe('2018-08-16T09:18:53+08:00')
  t.tz('America/New_York')
  expect(t.transformTimestampToStr(1542589200)).toBe('2018-11-18T20:00:00-05:00')
  expect(t.transformTimestampToStr(1542589200, 'YYYY/MM/DD HH:mm:ss')).toBe('2018/11/18 20:00:00')
  expect(t.transformStrToTimestamp('2018/11/18 20:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542589200)
})

test('transformStrToTimestamp()', () => {
  const t = new Time()
  t.utcOffset(-240)
  expect(t.transformStrToTimestamp('2018/11/19 21:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542675600)
  expect(t.transformStrToTimestamp('2018/11/20 00:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542686400)
  expect(t.transformStrToTimestamp('2018/11/20', 'YYYY/MM/DD')).toBe(1542686400)

  t.utcOffset(480)
  t.update(1542675600)
  expect(t.format()).toBe('2018-11-20T09:00:00+08:00')
  expect(t.transformStrToTimestamp('2018/11/19 09:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542589200)
  expect(t.transformStrToTimestamp('2018/11/20 00:00:00', 'YYYY/MM/DD HH:mm:ss')).toBe(1542643200)
  expect(t.transformStrToTimestamp('2018/11/20', 'YYYY/MM/DD')).toBe(1542643200)
})

test('format()', () => {
  const t = new Time()
  expect(t.format()).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}/)
  expect(t.format('YYYY/MM/DD HH:mm:ss')).toMatch(/\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}/)
})

test('tz()', () => {
  const t = new Time()
  t.tz('America/New_York')
  expect(t.format()).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}/)

  t.tz('Europe/Amsterdam')
  expect(t.format()).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/)
})

test('getTime()', () => {
  const t = new Time()
  expect(String(t.getTime())).toMatch(/\d{12}/)
})

test('getUnixTime()', () => {
  const t = new Time()
  expect(String(t.getUnixTime())).toMatch(/\d{10}/)
})

test('update()', () => {
  const t = new Time()
  expect(t.update(1534382333).getTime()).toBe(1534382333000)
  expect(t.update(1534382333).getUnixTime()).toBe(1534382333)
})

test('utcOffset()', () => {
  const t = new Time()
  t.update(1541485485) // 2018-11-06T14:24:45+08:00 => 1541485485
  t.utcOffset(-240)
  expect(t.utcOffset()).toBe(-240)
  expect(t.getUnixTime()).toBe(1541485485)
  expect(t.format()).toBe('2018-11-06T02:24:45-04:00')
})
