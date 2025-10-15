<script lang="ts" setup>
const { title } = defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="text-h4">{{ title }}</h2>
  <slot></slot>
</template>
