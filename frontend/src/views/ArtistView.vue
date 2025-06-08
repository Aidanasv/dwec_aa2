<script setup lang="ts">
import { onMounted } from 'vue';
import { useArtistsStore } from '@/stores/useArtistsStore';
import { useRouter } from 'vue-router';

const artistsStore = useArtistsStore();
const router = useRouter();

onMounted(() => {
    artistsStore.fetchArtists();
})

function goToAlbum(id: number) {
    router.push({ name: "albums", params: { id } })
}
</script>

<template>
    <v-row align="center" style="height: 150px" no-gutters>
        <v-col class="pa-2" v-for="artist in artistsStore.artists" :key="artist.id" cols="12" sm="5" md="3">

            <v-card class="mx-auto" max-width="250" color="primary" @click="goToAlbum(artist.id)">

                <v-card-title>{{ artist.name }}</v-card-title>

                <v-card-subtitle class="pt-4">{{ artist.genre }}</v-card-subtitle>

                <v-img :src="artist.image" color="surface-variant" height="200" cover></v-img>

                <v-card-text>
                    <div>{{ artist.country }}</div>
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>

</template>
