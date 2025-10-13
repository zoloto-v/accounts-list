<template>
  <Header />

  <main class="flex-grow-1">
    <v-container>
      <v-row>
        <v-col>
          <AccountPage />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup lang="ts">
import { Header } from '@/shared/ui/header';
import { AccountPage } from '@/pages/accounts';
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
