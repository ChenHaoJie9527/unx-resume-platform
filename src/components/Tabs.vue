<template>
  <div>useTabs</div>
</template>
<script setup lang="ts">
import { computed, withDefaults } from 'vue';
const props = withDefaults(defineProps<{ foo: string; bar: string }>(), {
    foo: 'hello',
    bar: 'vue3'
})
const res = computed(() => {
    console.log(props.foo);
    console.log(props.bar);
    return {
        foo: props.foo,
        bar: props.bar
    };
})
console.log('res', res.value);
</script>
