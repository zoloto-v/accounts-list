<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mdiDelete, mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';
import { TYPE_TEXT, type IAccount } from '@/entities/accountList/model/type';

const itemsPerPage = ref(10)
const formRef = ref<typeof import('vuetify/components')['VForm'] | null>(null)

const accountsStore = useAccountStore()

const rules = {
  required: (value: string) => !!value || 'Поле обязательно',
  maxLength: (l = 5) => (value: string) => value?.length < l || `Превышено число символов ${l}`,
}

onMounted(() => {
  accountsStore.fetchAll()
})

const onLabelInput = (id: string, payload: IAccount, newVal: string) => {
  const value = newVal.split(';').map(text => ({ text }));
  accountsStore.update(id, {
    ...payload,
    labels: value,
  });
}
const onTypeChange = (id: string, value: IAccount, newVal: keyof typeof TYPE_TEXT) => {
  const currentValue = accountsStore.find(id);

  if (currentValue) {
    const updatedAccount = (newVal === 'LDAP') ? {
      ...currentValue,
      password: null,
      type: newVal
    } : {
      ...currentValue,
      type: newVal
    }

    accountsStore.update(id, updatedAccount)
  }
}
const validateForm = async () => {
  const res = await formRef.value?.validate()
  if (!res) return;
  return (res?.valid) ? Promise.resolve(true) : Promise.reject(false)
}

accountsStore.$subscribe(() => {
  (async () => {
    try {
      const isValid = await validateForm();
      if (isValid) {
        accountsStore.saveToLocalStorage()
      }
    } catch {
      console.error('form is not valid');
    }
  })()
}, { detached: false })
</script>

<template>
  <v-sheet border rounded="">
    <v-data-iterator :items="accountsStore.accounts.accounts" :items-per-page="itemsPerPage">
      <template v-slot:default="{ items }">
        <v-form ref="formRef">
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
                <td>
                  <v-text-field variant="underlined" :value="value.raw.labels?.map(v => v.text).join(';')"
                    @update:model-value="(newVal) => onLabelInput(value.raw.id, value.raw, newVal)" maxlength="50" />
                </td>
                <td>
                  <v-select @update:model-value="(newVal) => onTypeChange(value.raw.id, value.raw, newVal)"
                    :items="['LDAP', 'LOCAL']" variant="underlined" :value="TYPE_TEXT[value.raw.type]" />
                </td>
                <td>
                  <v-text-field variant="underlined" v-model="value.raw.login"
                    :rules="[rules.required, rules.maxLength(100)]" maxlength="100" />
                </td>
                <td>
                  <v-text-field :disabled="value.raw.type === 'LDAP'" variant="underlined" v-model="value.raw.password"
                    :rules="value.raw.type === 'LDAP' ? [] : [rules.required, rules.maxLength(100)]" maxlength="100" />
                </td>
                <td>
                  <v-icon :icon="mdiDelete" size="small" @click="accountsStore.remove(value.raw.id)" />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
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
