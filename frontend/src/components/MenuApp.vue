<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

function goTo(route: string) {
  router.push({ name: route })
}

</script>

<template>
  <div class="d-flex align-center flex-grow-1" style="gap: 16px;">
    <v-btn @click="goTo('home')">
      <v-icon>mdi-home</v-icon>
      {{ t('home') }}
    </v-btn>

    <v-btn @click="goTo('artists')">
      <v-icon>mdi-account-music</v-icon>
      {{ t('artists') }}
    </v-btn>
  </div>
</template>
