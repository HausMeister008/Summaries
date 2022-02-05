<script setup lang="ts">
import AddSum from './AddSum.vue'
import { ref, Ref, watch } from 'vue'
import SelectAccessUserPanel from './SelectAccessUserPanel.vue';

export interface Properties {
    username: string,
    nSummaries: string,
    firstname: string,
    lastname: string,
    avg_rating: number,
    avatar?: string,
    is_creator: boolean
}

const showSelectedAccessUsersPanel: Ref<boolean> = ref(false)
const restrict_access: Ref<boolean> = ref(false)

const props = defineProps<Properties>();

const selected_users: Ref<number[]> = ref([])

watch(restrict_access, (n, o)=>{
    console.log(n)
    if(n){
        showSelectedAccessUsersPanel.value = true
    }
})

</script>
<template>
    <div class="user_info">
        <div id="profile_top">
            <div class="profile_image_container">
                <img
                    :src="props.avatar ? '/src/assets/images/' + props.avatar : '/src/assets/images/headphones_small.jpg'"
                    alt="profile picture"
                    class="profile_image"
                />
            </div>
        </div>
        <h1 class="profile_headline">{{ props.firstname }} {{ props.lastname }}</h1>
        <p class="profile_component">Benutzername: {{ props.username }}</p>
        <p
            v-if="props.is_creator"
            class="profile_component"
        >Hochgeladene Zusammenfassungen: {{ props.nSummaries }}</p>
        <p
            v-if="props.is_creator"
            class="profile_component"
        >Durchschnittliche Bewertung: {{ props.avg_rating ? props.avg_rating : 'Keine vorhanden' }}</p>
        <add-sum
            class="profile_component"
            v-model:showRestricUsers="restrict_access"
            :addusers="selected_users"
            v-if="props.is_creator"
        />
    </div>
    <select-access-user-panel v-model:adduser_array="selected_users" v-model:show="showSelectedAccessUsersPanel" />
</template>
<style scoped>
.user_info {
    min-height: 250px;
    box-shadow: 0 0 15px var(--box_shadows_dark);
    border-radius: 5px;
    margin-top: 50px;
    color: var(--base);
    background: var(--anti_base);
    padding: 2rem 4rem;
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.profile_component {
    margin-top: 1.5rem;
    font-size: 1.2rem;
}
.profile_headline {
    margin-top: 10px;
}
#profile_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    transform: translateY(-50px); /*translateX(-180%)*/
}
#profile_top * + * {
    margin-left: 1.5rem;
}
.profile_image_container {
    --width: 100px;
    width: var(--width);
    height: var(--width);
    padding: 10px;
    border-radius: 50%;
    background: var(--anti_base);
    position: relative;
    z-index: 2;
    box-shadow: 0 -5px 5px var(--box_shadows);
}
.profile_image_container::before,
.profile_image_container::after {
    content: "";
    position: absolute;
    top: 0px;
    width: calc(var(--width) / 2);
    height: calc(var(--width) / 2);
    background: transparent;
    border-radius: 50%;
    z-index: -1;
    transition: background 1s, box-shadow 1s;
}
.profile_image_container::before {
    left: calc(var(--width) / -2);
    transform: translateX(4px);
    box-shadow: 21px 33px var(--anti_base);
}
.profile_image_container::after {
    right: calc(var(--width) / -2);
    transform: translateX(-4px);
    box-shadow: -21px 33px var(--anti_base);
}
.profile_image {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50px;
}
</style>