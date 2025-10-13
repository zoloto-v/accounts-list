<script setup lang="ts">
import { TitleComponent } from '@/shared/ui/title';
import { mdiHelpCircleOutline } from '@mdi/js'
</script>

<template>
  <TitleComponent title="Учетные записи" class="mb-12" />
  <v-alert color="grey" density="compact" :icon="mdiHelpCircleOutline" class="mb-12">
    Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
  </v-alert>
</template>

<style scoped></style>
