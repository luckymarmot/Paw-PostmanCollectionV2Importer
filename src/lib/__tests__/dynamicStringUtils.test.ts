import Paw from '../../types-paw-api/paw'
import EnvironmentManager from '../EnvironmentManager'
import { makeDs } from '../dynamicStringUtils'


class DummyDynamicValue {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

const dummyDv = (name: string): DummyDynamicValue => {
  return new DummyDynamicValue(`<<<${name}>>>`)
}

jest.mock('../EnvironmentManager', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getDynamicValue: jest.fn().mockImplementation((name: string) =>
        dummyDv(name)),
    };
  });
});

const dsMock: DynamicString = (jest.fn() as any)

describe('makeDs', () => {
  let environmentManager: EnvironmentManager

  beforeEach(() => {
    (EnvironmentManager as any).mockClear();
    (dsMock as any).mockClear();
    let context: Paw.Context = (null as any as Paw.Context);
    environmentManager = new EnvironmentManager(context);
    (global as any).DynamicString = dsMock;
  })

  test('works with an empty string', () => {
    // check mockClear
    expect(environmentManager.getDynamicValue).not.toBeCalled();
    expect(dsMock).not.toBeCalled();

    // run
    const ds = makeDs('', environmentManager);

    // expect
    expect(ds).toStrictEqual('');
    expect(environmentManager.getDynamicValue).not.toBeCalled();
  })

  test('works with only a string', () => {
    // check mockClear
    expect(environmentManager.getDynamicValue).not.toBeCalled();
    expect(dsMock).not.toBeCalled();

    // run
    const ds = makeDs('https://paw.cloud/api/v3/', environmentManager);

    // expect
    expect(ds).toStrictEqual('https://paw.cloud/api/v3/');
    expect(environmentManager.getDynamicValue).not.toBeCalled();
  })

  test('works with only a variable', () => {
    // check mockClear
    expect(environmentManager.getDynamicValue).not.toBeCalled();
    expect(dsMock).not.toBeCalled();

    // run
    makeDs('{{username}}', environmentManager);

    // expect
    expect(environmentManager.getDynamicValue).toBeCalled();
    expect((environmentManager.getDynamicValue as any).mock.calls[0]).toEqual([
      'username'
    ]);
    expect(dsMock).toBeCalled();
    expect((dsMock as any).mock.calls[0]).toEqual([
      dummyDv('username')
    ]);
  })

  test('works with a URL string', () => {
    // check mockClear
    expect(environmentManager.getDynamicValue).not.toBeCalled();
    expect(dsMock).not.toBeCalled();

    // run
    makeDs('https://paw.cloud/api/v3/users/{{username}}/profile', environmentManager);

    // expect
    expect(environmentManager.getDynamicValue).toBeCalled();
    expect((environmentManager.getDynamicValue as any).mock.calls[0]).toEqual([
      'username'
    ]);
    expect(dsMock).toBeCalled();
    expect((dsMock as any).mock.calls[0]).toEqual([
      'https://paw.cloud/api/v3/users/',
      dummyDv('username'),
      '/profile'
    ]);
  })

  test('works with a URL string with multiple params', () => {
    // check mockClear
    expect(environmentManager.getDynamicValue).not.toBeCalled();
    expect(dsMock).not.toBeCalled();

    // run
    makeDs('https://paw.cloud/api/v3/users/{{username}}/{{page}}/?tab={{my_tab}}', environmentManager);

    // expect
    expect(environmentManager.getDynamicValue).toBeCalled();
    expect((environmentManager.getDynamicValue as any).mock.calls[0]).toEqual([
      'username'
    ]);
    expect(dsMock).toBeCalled();
    expect((dsMock as any).mock.calls[0]).toEqual([
      'https://paw.cloud/api/v3/users/',
      dummyDv('username'),
      '/',
      dummyDv('page'),
      '/?tab=',
      dummyDv('my_tab')
    ]);
  })
})
