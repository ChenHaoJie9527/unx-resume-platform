import { computed, defineComponent, } from 'vue';
import {
  PropTypes,
  normalizeProps,
  useMachine,
  useSetup,
  mergeProps,
} from '@zag-js/vue';
import * as toggle from '@zag-js/toggle';

export default defineComponent({
  name: 'Toggle',
  setup() {
    const [state, send] = useMachine(toggle.machine);
    const ref = useSetup<HTMLButtonElement>({ send, id: '1' });
    const apiRef = computed(() =>
      toggle.connect<PropTypes>(state.value, send, normalizeProps)
    );
    const api = apiRef.value;
    const onClick = () => {
      console.log('api', api);
    };
    // mergeProps合并属性函数
    const buttonProps = mergeProps(apiRef.value, {
      onClick,
    });
    return () => {
      return (
        <button ref={ref.value} {...buttonProps}>
          {api.isPressed ? 'On' : 'Off'}
        </button>
      );
    };
  },
});
