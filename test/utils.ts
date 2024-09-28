import { MockInstance, expect } from 'vitest'

export function assertSpy(spy: MockInstance, calledWith: unknown[] = [], calledTimes = 1) {
  expect(spy).toBeCalledTimes(calledTimes)
  expect(spy).toBeCalledWith(...calledWith)
}
