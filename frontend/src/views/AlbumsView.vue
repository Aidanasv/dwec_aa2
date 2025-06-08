<script setup lang="ts">
import { onMounted } from 'vue';
import { useAlbumStore } from '@/stores/useAlbumsStore';
import { useRouter } from 'vue-router';

const albumsStore = useAlbumStore();
const router = useRouter();
const props = defineProps<{ id: string }>()

onMounted(() => {
    albumsStore.fetchAlbumsByArtists(props.id);
})

function goToSongs(id: number) {
    router.push({ name: "songs", params: { id } })
}
</script>

<template>
    <v-row align="center" style="height: 150px" no-gutters>
        <v-col class="pa-2" v-for="album in albumsStore.albums" :key="album.id" cols="12" sm="5" md="3">

            <v-card class="mx-auto" width="250" color="primary" @click="goToSongs(album.id)">

                <v-card-title>{{ album.title }}</v-card-title>

                <v-img :src="album.image" height="200" cover></v-img>

                <v-card-text>
                    <div>{{ album.year }}</div>
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>
</template>
