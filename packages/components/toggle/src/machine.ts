import { createMachine } from '@zag-js/core';

export default createMachine({
  initial: 'active', // εε§ηΆζ
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
