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

const show_profile_not_files: Ref<boolean> = ref(true)


watch(restrict_access, (n, o) => {
    console.log(n)
    if (n) {
        showSelectedAccessUsersPanel.value = true
    }
})

</script>
<template>
    <div class="user_info">
        <div id="profile_top">
            <button
                class="profile_image_container profile_top_button"
                @click="show_profile_not_files = true"
            >
                <img
                    :src="props.avatar ? '/src/assets/images/' + props.avatar : '/src/assets/images/headphones_small.jpg'"
                    alt="profile picture"
                    class="profile_image"
                />
            </button>
            <button
                class="profile_image_container profile_top_button"
                @click="show_profile_not_files = false"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    data-v-2210c1cc
                    class="profile_image"
                >
                    <title data-v-2210c1cc>Browse Files</title>
                    <path
                        d="M 6 2 C 4.9057453 2 4 2.9057453 4 4 L 4 20 C 4 21.094255 4.9057453 22 6 22 L 18 22 C 19.094255 22 20 21.094255 20 20 L 20 8 L 14 2 L 6 2 z M 6 4 L 13 4 L 13 9 L 18 9 L 18 20 L 6 20 L 6 4 z"
                        data-v-2210c1cc
                    />
                </svg>
            </button>
        </div>
        <transition name="change_profile_content" mode="out-in">
            <div class="user_data" v-if="show_profile_not_files">
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
            <div class="user_sums" v-else>
                <h1>Deine Zusammenfassungen</h1>
            </div>
        </transition>
    </div>
    <select-access-user-panel
        v-model:adduser_array="selected_users"
        v-model:show="showSelectedAccessUsersPanel"
    />
</template>
<style scoped>
.user_info {
    min-height: 250px;
    max-height: calc(90vh - var(--nav_height));
    width: 80vw;
    box-shadow: 0 0 15px var(--box_shadows_dark);
    border-radius: 5px;
    margin-top: 50px;
    color: var(--base);
    background: var(--anti_base);
    padding: 4rem 0 0 0 ;
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 1s, height .2s;
}
.profile_component {
    margin-top: 1.5rem;
    font-size: 1.2rem;
}
.profile_headline {
    margin-top: 10px;
}
#profile_top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
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
.profile_top_button {
    border: none;
    outline: none;
    background: var(--anti_base);
    color: var(--base);
}
.profile_top_button:hover {
    cursor: pointer;
}
.profile_image {
    object-fit: cover;
    width: 90%;
    height: 90%;
    border-radius: 50px;
    transition: all 1s, transform 0.2s;
}

.user_data, .user_sums{
    position:relative;
    width: 90%;
    padding: 0 2rem 2rem 2rem;
    height: calc(80vh - var(--nav_height) - 4rem);
    overflow: auto;
    scrollbar-width: thin;
}


.profile_top_button:hover > .profile_image {
    transform: scale(1.1);
}

.change_profile_content-enter-from {
    transform: translateX(-10%);
    opacity: 0;
}
.change_profile_content-leave-to {
    transform: translateX(30%);
    opacity: 0;
}
.change_profile_content-leave-active,
.change_profile_content-enter-active {
    transition: transform 0.4s, opacity 0.4s;
}
</style>