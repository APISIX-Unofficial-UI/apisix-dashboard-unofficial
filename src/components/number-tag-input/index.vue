<script setup lang="ts">
import { TagInput as TTagInput, TagInputProps, TagProps } from 'tdesign-vue-next'; // 假设可以导入类型
import { computed, WritableComputedRef } from 'vue';

interface Props {
  modelValue: number[];
  placeholder?: string;
  tagProps?: TagProps;
  excessTagsDisplayType?: TagInputProps['excessTagsDisplayType'];
  autoWidth?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  tagProps: () => ({ theme: 'primary', variant: 'light' }),
  excessTagsDisplayType: 'scroll',
  autoWidth: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();

const internalStringModel: WritableComputedRef<string[]> = computed({
  get(): string[] {
    return props.modelValue.map(String);
  },
  set(newValue: string[]): void {
    const numbers = newValue.map((str) => parseInt(str, 10)).filter((num): num is number => !Number.isNaN(num));
    emit('update:modelValue', numbers);
  },
});
</script>

<template>
  <t-tag-input
    v-model="internalStringModel"
    :placeholder="placeholder"
    :tag-props="tagProps"
    :excess-tags-display-type="excessTagsDisplayType"
    :auto-width="autoWidth"
  />
</template>
