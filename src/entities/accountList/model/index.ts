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

  function fetchAll() {
    accounts.value.accounts = [
      {
        id: 'd23fc90c-39ce-4b15-bfde-9aabc560c2d4',
        labels: [
          {
            text: 'XXX',
          },
          {
            text: 'UUU',
          },
          {
            text: 'NNNNИИИ',
          },
        ],
        type: TYPE_TEXT['LDAP'],
        login: 'Chevrolet Camaro',
        password: null,
      },
      {
        id: 'd23fc90c-a9ce-4b15-bfde-9aabc560c2d1',
        labels: [],
        type: 'LDAP',
        login: 'Ford Mustang',
        password: null,
      },
      {
        id: 'd23fc90c-55ce-4b15-bfde-9aabc560c2d4',
        labels: [
          { text: 'DD' },
          {
            text: 'MMMM',
          },
        ],
        type: 'LDAP',
        login: 'Dodge Charger',
        password: null,
      },
      {
        id: 'd23fc90c-22ce-4b15-bfde-9aabc560c2d4',
        labels: [{ text: 'MM' }, { text: 'YYYY' }],
        type: 'LOCAL',
        login: 'Pontiac GTO',
        password: '123456',
      },
      {
        id: 'd23fc90c-39ce-4b15-bfde-9aabc560ceee',
        labels: [{ text: 'ddMM' }, { text: 'ssss' }],
        type: 'LOCAL',
        login: 'Plymouth Barracuda',
        password: '123456',
      },
      // {
      //   id: 'd23fc90c-39ce-4b15-bfde-9aabc560cqqq',
      //   labels: [{ text: 'hhhhSS' }, { text: 'KKKK' }],
      //   type: 'LOCAL',
      //   login: 'Chevrolet Chevelle',
      //   password: '123456',
      // },
      // {
      //   id: 'd23fc90c-39ce-4b15-bfde-9aabc560c333',
      //   labels: [{ text: 'UUUU' }, { text: 'ddd' }],
      //   type: 'LOCAL',
      //   login: 'Oldsmobile 442',
      //   password: '123456',
      // },
      // {
      //   id: 'd23fc90c-39ce-4b15-bfde-9aabc560c211',
      //   labels: [],
      //   type: 'LOCAL',
      //   login: 'Dodge Challenger',
      //   password: '123456',
      // },
      // {
      //   id: 'd23fc90c-39ce-4b15-bfde-9aabc560cvvv',
      //   labels: [{ text: 'yyyy' }],
      //   type: 'LOCAL',
      //   login: 'AMC Javelin',
      //   password: 'eeedddaaa',
      // },
      // {
      //   id: 'd23fc90c-39ce-4b15-bfde-9aabc560cuuu',
      //   labels: [{ text: 'YYYY' }],
      //   type: 'LOCAL',
      //   login: 'Mercury Cougar',
      //   password: 'aaabbbccc',
      // },
    ]
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

  return { accounts, add, remove, update, find, fetchAll }
})
