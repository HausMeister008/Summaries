<script setup lang="ts">
import { defineProps } from 'vue'

export interface Properties {
    username: string,
    nSummaries: string,
    firstname: string,
    lastname: string,
    avg_rating: string,
    avatar?: string
}

const props = defineProps<Properties>();
</script>
<template>
    <div class="user_info">
        <div id="profile_top">
            <img
                :src="props.avatar ? '/src/assets/images/' + props.avatar : '/src/assets/images/headphones_small.jpg'"
                alt="profile picture"
                class="profile_image"
            />
            <h1>{{ props.firstname }} {{ props.lastname }}</h1>
        </div>
        <p class="profile_comonent">Benutzername: {{ props.username }}</p>
        <p class="profile_comonent">Hochgeladene Zusammenfassungen: {{ props.nSummaries }}</p>
        <p
            class="profile_comonent"
        >Durchschnittliche Bewertung: {{ props.avg_rating ? props.avg_rating : 'Keine vorhanden' }}</p>
    </div>
</template>
<style scoped>
.profile_comonent {
    font-size: 1.2rem;
    margin-top: 1.5rem;
}
#profile_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
#profile_top * + * {
    margin-left: 1.5rem;
}
.profile_image {
    object-fit: cover;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    box-shadow: 0 0 15px var(--box_shadows_dark);
}
</style>