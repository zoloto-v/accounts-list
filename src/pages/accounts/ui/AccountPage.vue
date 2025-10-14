<script setup lang="ts">
import { mdiHelpCircleOutline } from '@mdi/js'
import { TitleComponent } from '@/shared/ui/title';
import AccountList from './AccountList.vue';
</script>

<template>
  <TitleComponent title="Учетные записи" class="mb-12" />
  <v-alert color="grey" density="compact" :icon="mdiHelpCircleOutline" class="mb-12">
    Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
  </v-alert>
  <AccountList />
</template>

<style scoped></style>
