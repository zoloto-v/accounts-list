<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';

const { add } = useAccountStore();
</script>

<template>
  <v-btn :icon="mdiPlus" comfortable @click="add"></v-btn>
</template>
