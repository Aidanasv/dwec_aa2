<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <v-app >
    <HeaderComponent />
    <v-main scrollable>
      <v-container fluid>
        <RouterView/>
      </v-container>
      
    </v-main>
    <FooterComponent />
  </v-app>
</template>
