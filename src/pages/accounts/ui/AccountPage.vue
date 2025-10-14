<script setup lang="ts">
import { mdiHelpCircleOutline } from '@mdi/js'
import { AddAccountButton } from '@/features/addAccountButton';
import AccountList from './AccountList.vue';
</script>

<template>
  <h2 class="text-h4 mb-10">
    Учетные записи
    <AddAccountButton />
  </h2>
  <v-alert color="grey" density="compact" :icon="mdiHelpCircleOutline" class="mb-12">
    Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
  </v-alert>
  <AccountList />
</template>

<style scoped></style>
