<script lang="ts" setup>
const props = defineProps<{
    firstname: string,
    lastname: string,
    username: string,
    is_creator: boolean,
    nSummaries: string,
    avg_rating?: number
}>()
</script>

<template>
    <div class="user_data">
        <h1
            class="profile_headline profile_part_headline"
        >{{ props.firstname }} {{ props.lastname }}</h1>
        <p class="profile_component">Benutzername: {{ props.username }}</p>
        <p
            v-if="props.is_creator"
            class="profile_component"
        >Hochgeladene Zusammenfassungen: {{ props.nSummaries }}</p>
        <p
            v-if="props.is_creator"
            class="profile_component"
        >Durchschnittliche Bewertung: {{ props.avg_rating ? props.avg_rating : 'Keine vorhanden' }}</p>
    </div>
</template>