<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mdiDelete, mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';

const accountsStore = useAccountStore()

const itemsPerPage = ref(10)

const remove = (id: string) => {
  accountsStore.remove(id)
}

onMounted(() => {
  accountsStore.fetchAll()
})
</script>

<template>
  <v-sheet border rounded="">
    <v-data-iterator :items="accountsStore.accounts.accounts" :items-per-page="itemsPerPage">
      <template v-slot:default="{ items }">
        <v-table>
          <thead>
            <tr>
              <th>Метки</th>
              <th>Тип записи</th>
              <th>Логин</th>
              <th>Пароль</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, i) in items" :key="i">
              <td>{{value.raw.labels?.map(v => v.text).join('')}}</td>
              <td>{{ value.raw.type }}</td>
              <td>{{ value.raw.login }}</td>
              <td>{{ value.raw.password }}</td>
              <td>
                <v-icon :icon="mdiDelete" size="small" @click="remove(value.raw.id)"></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn :disabled="page === 1" density="comfortable" :icon="mdiArrowLeft" variant="tonal" rounded
            @click="prevPage"></v-btn>

          <div class="mx-2 text-caption">
            Страница {{ page }} из {{ pageCount }}
          </div>

          <v-btn :disabled="page >= pageCount" density="comfortable" :icon="mdiArrowRight" variant="tonal" rounded
            @click="nextPage"></v-btn>
        </div>
      </template>
    </v-data-iterator>
  </v-sheet>
</template>
