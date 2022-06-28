import { createMachine } from '@zag-js/core';

export default createMachine({
  initial: 'active', // 初始状态
  states: {
    active: {
      on: {
        click: {
          target: 'inactive',
        },
      },
    },
    inactive: {
      on: {
        click: {
          target: 'active',
        },
      },
    },
  },
});
