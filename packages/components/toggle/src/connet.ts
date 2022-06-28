import { StateMachine } from '@zag-js/core';

const connect = (state, send) => {
  const active = state.machine('active');
  return {
    active,
    buttonProps: {
      type: 'button',
      role: 'switch',
      'aria-checked': active,
      onClick() {
        send('click');
      },
    },
  };
};

export default connect;
