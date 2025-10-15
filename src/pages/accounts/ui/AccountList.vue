<script setup lang="ts">
import { ref, onMounted, onScopeDispose } from 'vue'
import { mdiDelete, mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useAccountStore } from '@/entities/accountList/model';
import { TYPE_TEXT, type IAccount } from '@/entities/accountList/model/type';
import type { VForm } from 'vuetify/components';
import ConfirmDialog from './ConfirmDialog.vue';

const accountId = ref<string | null>(null)
const showModal = ref(false)
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
const deleteAccount = () => {
  if (accountId.value)
    accountsStore.remove(accountId.value)
  onClose()
}
const showDeleteConfirm = (id: string) => {
  showModal.value = true
  accountId.value = id
}
const onClose = () => {
  showModal.value = false
}
</script>

<template>
  <v-card rounded="" class="pa-6">
    <v-data-iterator :items="accountsStore.accounts.accounts" :items-per-page="itemsPerPage">
      <template v-slot:default="{ items }">
        <div class="form">
          <div>Метки</div>
          <div>Тип записи</div>
          <div>Логин</div>
          <div>Пароль</div>
          <div></div>
        </div>
        <div v-for="(value, i) in items" :key="i">
          <v-form :ref="(el) => formRefs[value.raw.id] = el as VForm" class="form">
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
            <div class="center">
              <v-icon :icon="mdiDelete" size="small" @click="() => showDeleteConfirm(value.raw.id)" />
            </div>
          </v-form>
        </div>
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

  <ConfirmDialog :showModal="showModal" :onApprove="deleteAccount" :onClose="onClose" title="Подтвердить удаление?" />
</template>

<style scoped>
.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr;
  gap: 20px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
