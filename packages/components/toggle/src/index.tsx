import { useMachine } from '@zag-js/vue';
import machine from './machine';
import connect from './connet';

function Toggle() {
  const [state, send] = useMachine(machine);
  const api = connect(state, send);
  return <button {...api.buttonProps}>{api.active ? 'OFF' : 'NO'}</button>;
}
