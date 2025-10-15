import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAccount, IAccountList } from './type'
import { TYPE_TEXT } from './type'

const defaultAccountList: IAccountList = {
  isPending: false,
  isError: false,
  accounts: [],
}

export const createAccount = (): IAccount => {
  return {
    id: String(new Date().getTime()),
    labels: [],
    type: TYPE_TEXT['LDAP'],
    login: '',
    password: null,
  }
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref(defaultAccountList)

  async function fetchAll() {
    accounts.value.accounts = loadFromLocalStorage()
  }

  function add() {
    accounts.value.accounts.push(createAccount())
  }

  function remove(id: string) {
    accounts.value.accounts = accounts.value.accounts.filter((a) => a.id !== id)
  }

  function find(id: string) {
    return accounts.value.accounts.find((a) => a.id === id)
  }

  function update(id: string, value: IAccount) {
    console.log('update', value)

    const index = accounts.value.accounts.findIndex((a) => a.id === id)
    accounts.value.accounts = [
      ...accounts.value.accounts.slice(0, index),
      value,
      ...accounts.value.accounts.slice(index + 1),
    ]
  }

  function saveToLocalStorage(accounts: Array<IAccount>) {
    const accountTxt = JSON.stringify(accounts)
    localStorage.setItem('accountsList', accountTxt)
  }

  function loadFromLocalStorage() {
    const accountTxt = localStorage.getItem('accountsList')
    return accountTxt ? JSON.parse(accountTxt) : []
  }

  return { accounts, add, remove, update, find, fetchAll, saveToLocalStorage, loadFromLocalStorage }
})
