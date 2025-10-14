<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, onScopeDispose } from 'vue'
import { mdiDelete, mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';
import { TYPE_TEXT, type IAccount } from '@/entities/accountList/model/type';
import type { VForm } from 'vuetify/components';

const itemsPerPage = ref(10)
const formRefs = ref<Record<string, InstanceType<typeof VForm>>>({})

const accountsStore = useAccountStore()

const rules = {
  required: (value: string) => !!value || 'Поле обязательно',
  maxLength: (l = 5) => (value: string) => value?.length < l || `Превышено число символов ${l}`,
}

onMounted(() => {
  accountsStore.fetchAll()

  const unsubscribe = accountsStore.$subscribe(() => {
    (async () => {
      const validAccounts: Array<IAccount> = [];

      for (const account of accountsStore.accounts.accounts) {
        const form = formRefs.value[account.id]
        const result = await form?.validate()

        if (result?.valid) {
          validAccounts.push(account);
        }
      }

      accountsStore.saveToLocalStorage(validAccounts)
    })()
  }, { detached: false })

  onScopeDispose(() => {
    unsubscribe()
  })
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
// const validateForm = async () => {
//   const res = await formRef.value?.validate()
//   if (!res) return;
//   return (res?.valid) ? Promise.resolve(true) : Promise.reject(false)
// }
</script>

<template>
  <v-card rounded="" class="pa-6">
    <v-data-iterator :items="accountsStore.accounts.accounts" :items-per-page="itemsPerPage">
      <template v-slot:default="{ items }">
        <div :style="{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr',
          gap: '20px',
        }">
          <div>Метки</div>
          <div>Тип записи</div>
          <div>Логин</div>
          <div>Пароль</div>
          <div></div>
        </div>
        <div v-for="(value, i) in items" :key="i">
          <v-form :ref="(el) => formRefs[value.raw.id] = el as VForm" :style="{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 0.5fr',
            gap: '20px',
          }">
            <div>
              <v-text-field variant="underlined" :value="value.raw.labels?.map(v => v.text).join(';')"
                @update:model-value="(newVal) => onLabelInput(value.raw.id, value.raw, newVal)" maxlength="50" />
            </div>
            <div>
              <v-select @update:model-value="(newVal) => onTypeChange(value.raw.id, value.raw, newVal)"
                :items="['LDAP', 'LOCAL']" variant="underlined" :value="TYPE_TEXT[value.raw.type]" />
            </div>
            <div>
              <v-text-field variant="underlined" v-model="value.raw.login"
                :rules="[rules.required, rules.maxLength(100)]" maxlength="100" />
            </div>
            <div>
              <v-text-field :disabled="value.raw.type === 'LDAP'" variant="underlined" v-model="value.raw.password"
                :rules="value.raw.type === 'LDAP' ? [] : [rules.required, rules.maxLength(100)]" maxlength="100" />
            </div>
            <div :style="{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }">
              <v-icon :icon="mdiDelete" size="small" @click="accountsStore.remove(value.raw.id)" />
            </div>
          </v-form>
        </div>

        <!-- <v-table>
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
              <td colspan="5">
                <v-form ref="(el) => formRefs[value.raw.id] = el">
                  <table>
                    <div>
                      <v-text-field variant="underlined" :value="value.raw.labels?.map(v => v.text).join(';')"
                        @update:model-value="(newVal) => onLabelInput(value.raw.id, value.raw, newVal)"
                        maxlength="50" />
                    </div>
                    <div>
                      <v-select @update:model-value="(newVal) => onTypeChange(value.raw.id, value.raw, newVal)"
                        :items="['LDAP', 'LOCAL']" variant="underlined" :value="TYPE_TEXT[value.raw.type]" />
                    </div>
                    <div>
                      <v-text-field variant="underlined" v-model="value.raw.login"
                        :rules="[rules.required, rules.maxLength(100)]" maxlength="100" />
                    </div>
                    <div>
                      <v-text-field :disabled="value.raw.type === 'LDAP'" variant="underlined"
                        v-model="value.raw.password"
                        :rules="value.raw.type === 'LDAP' ? [] : [rules.required, rules.maxLength(100)]"
                        maxlength="100" />
                    </div>
                    <div>
                      <v-icon :icon="mdiDelete" size="small" @click="accountsStore.remove(value.raw.id)" />
                    </div>
                  </table>
                </v-form>
              </td>
            </tr>
          </tbody>
        </v-table> -->
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
  </v-card>

  <!-- <v-sheet border rounded="">
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
  </v-sheet> -->
</template>
