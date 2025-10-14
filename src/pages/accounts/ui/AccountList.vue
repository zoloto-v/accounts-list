<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import type { VDataTable } from 'vuetify/components'
import type { IHeaders } from '../model/types';
import { mdiRefresh, mdiDelete, mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';

const accountsStore = useAccountStore()

const loading = shallowRef(false)

const headers: IHeaders = [
  { title: 'Метки', key: 'labels', align: 'start', sortable: false },
  { title: 'Тип записи', key: 'type', align: 'start' },
  { title: 'Логин', key: 'login', align: 'start' },
  { title: 'Пароль', key: 'password', align: 'start' },
  { title: '', key: 'actions', align: 'end', sortable: false },
]

function onClick() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

function add() {
  accountsStore.add()
}

function remove(id: unknown) {
  accountsStore.remove(id)
}

// function save() {
//   console.log('save')
// }

onMounted(() => {
  accountsStore.fetchAll()
})

</script>


<template>
  <!-- <div class="text-center mt-2 mb-4">
    <v-btn :disabled="loading" :prepend-icon="mdiRefresh" rounded="lg" text="Refresh" variant="text" border
      @click="onClick"></v-btn>
    <v-btn @click="add" rounded="lg" text="add" variant="text" border />
    <v-btn @click="remove" rounded="lg" text="remove" variant="text" border />
  </div>

  <v-sheet border rounded>
    <v-data-table :headers="headers" :items="accountsStore.accounts.accounts" :loading="loading">
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
<template v-slot:[`item.labels`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          {{item.labels?.map(l => l.text).join('_z').split(' ').join('_')}}
        </div>
      </template>
<template v-slot:[`item.actions`]="{ item }">
        <v-icon :icon="mdiDelete" size="small" @click="remove(item.id)"></v-icon>
      </template>
</v-data-table>
</v-sheet> -->
  <div class="text-center mt-2 mb-4">
    <v-btn :disabled="loading" :prepend-icon="mdiRefresh" rounded="lg" text="Refresh" variant="text" border
      @click="onClick"></v-btn>
    <v-btn @click="add" rounded="lg" text="add" variant="text" border />
    <v-btn @click="remove" rounded="lg" text="remove" variant="text" border />
  </div>
  <v-sheet border rounded="">
    <v-data-iterator :items="accountsStore.accounts.accounts" items-per-page="5" :loading="false">
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
      <template v-slot:loader>
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
            <tr v-for="(value, i) in [0, 1, 2, 3, 4]" :key="i">
              <!-- <td colspan="5">
              <v-skeleton class="border" type="paragraph"></v-skeleton>
            </td> -->
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
