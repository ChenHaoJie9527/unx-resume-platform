import { defineComponent, withModifiers } from 'vue';
import styles from '@/styles/Header.module.scss';
export default defineComponent({
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    onClicks() {
      console.log('点击了+1111111111111111');
    },
    inc(val: any) {
      console.log('val', val);
      this.count++;
    },
  },
  render() {
    return (
      <>
        <div class={styles.header}>Header</div>
        <button onClick={this.onClicks}>点击按钮</button>
        <div onClick={withModifiers(() => this.inc(10), ['self'])}>
          点击：{this.count}
        </div>
      </>
    );
  },
});
