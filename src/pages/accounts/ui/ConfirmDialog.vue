<script setup lang="ts">
import Modal from '@/shared/ui/modal/ModalDefault.vue'

const { title = '' } = defineProps<{
  title?: string,
  showModal: boolean,
  onApprove: () => void,
  onClose: () => void,
}>()
</script>

<template>
  <Teleport to="body">
    <modal :show="showModal" @close="onClose">
      <template #header>
        <h3 class="text-h6 font-weight-bold pt-4">{{ title }}</h3>
      </template>
      <template #body>
        <v-row />
      </template>
      <template #footer>
        <v-row class="flex pb-4 ga-2" justify="end">
          <v-btn @click="$emit('close')" density="compact" rounded="0" variant="outlined" color="grey-darken-1">
            Отмена
          </v-btn>
          <v-btn @click="onApprove" density="compact" rounded="0" variant="flat" color="red-darken-1">
            Удалить
          </v-btn>
        </v-row>
      </template>
    </modal>
  </Teleport>
</template>

<style>
.card {
  display: block;
  height: 500px;
  width: 100px;
}
</style>
