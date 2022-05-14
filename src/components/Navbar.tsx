import { defineComponent, withModifiers } from 'vue';
export default defineComponent({
  setup() {
    const count = ref(0);
    const inc = (val: number) => {
      console.log('val', val);
      count.value++;
    };
    return () => (
      // withModifiers 可以附带修饰符
      <div onClick={withModifiers(() => inc(10), ['stop'])}>点击</div>
    );
  },
});
