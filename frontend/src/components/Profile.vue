<script setup lang="ts">
import AddSum from './AddSum.vue'
import { ref, Ref, watch } from 'vue'
import SelectAccessUserPanel from './SelectAccessUserPanel.vue';
import MySummaries from './MySummaries.vue';

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
const searched_sum:Ref<string> = ref('')


const props = defineProps<Properties>();

const selected_users: Ref<number[]> = ref([])

const show_profile_not_files: Ref<number> = ref(0)
const middle_slide_direction: Ref<number> = ref(1)

async function transition_vars(new_pos: number) {
    var old_pos = show_profile_not_files.value
    // middle_slide_direction.value = (old_pos-new_pos)%1
    if (old_pos == 1 && new_pos > old_pos) {
        middle_slide_direction.value = -1
    }
    else if (old_pos == 1 && new_pos < old_pos) {
        middle_slide_direction.value = 1
    }
    else if (old_pos != 1 && new_pos > old_pos) {
        middle_slide_direction.value = 1
    } else if (old_pos != 1 && new_pos < old_pos) {
        middle_slide_direction.value = -1
    }

}


watch(restrict_access, (n, o) => {
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
                @mouseenter="transition_vars(0)"
                @click="show_profile_not_files = 0"
                title="Mein Profil"
                :class="show_profile_not_files == 0 ? 'active' : ''"
            >
                <img
                    :src="props.avatar ? '/src/assets/images/' + props.avatar : '/src/assets/images/headphones_small.jpg'"
                    alt="profile picture"
                    class="profile_image"
                />
            </button>
            <button
                class="profile_image_container profile_top_button"
                @mouseenter="transition_vars(1)"
                @click="show_profile_not_files = 1"
                :class="show_profile_not_files == 1 ? 'active' : ''"
                v-if="props.is_creator"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    data-v-2210c1cc
                    class="profile_image"
                    id="edit_sums_svg"
                >
                    <title data-v-2210c1cc>Meine Zusammenfassungen</title>
                    <path
                        d="M 6 2 C 4.9057453 2 4 2.9057453 4 4 L 4 20 C 4 21.094255 4.9057453 22 6 22 L 18 22 C 19.094255 22 20 21.094255 20 20 L 20 8 L 14 2 L 6 2 z M 6 4 L 13 4 L 13 9 L 18 9 L 18 20 L 6 20 L 6 4 z"
                        data-v-2210c1cc
                    />
                </svg>
            </button>
            <button
                class="profile_image_container profile_top_button"
                @mouseenter="transition_vars(2)"
                @click="show_profile_not_files = 2"
                title="Zusammenfassungen hochladen"
                :class="show_profile_not_files == 2 ? 'active' : ''"
                id="addsum_interface_button"
                v-if="props.is_creator"
            >
                <span class="profile_image">+</span>
            </button>
        </div>
        <transition name="change_profile_content" mode="out-in">
            <div class="user_data" v-if="show_profile_not_files == 0">
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
            <div
                class="user_sums"
                v-else-if="show_profile_not_files == 1 && props.is_creator"
                :style="`--slide_direction:${middle_slide_direction}`"
            >
                <h1 class="profile_part_headline">Meine Zusammenfassungen</h1>
                <div id="search">
                    <input id="searchBar" type="search" v-model="searched_sum" required />
                    <label id="searchBarLabel" for="searchBar">Suche (Name, Fach oder Schule)...</label>
                    <!-- <div>Du suchst nach {{ username }}</div> -->
                </div>
                <my-summaries v-model:searched_sum="searched_sum"/>
            </div>
            <div class="add_sum" v-else-if="show_profile_not_files == 2 && props.is_creator">
                <h1 class="profile_part_headline">Zusammenfassungen hochladen</h1>
                <add-sum
                    class="profile_component"
                    v-model:showRestricUsers="restrict_access"
                    :addusers="selected_users"
                    v-if="props.is_creator"
                />
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
    max-height: calc(90vh - var(--top_margin));
    width: 80vw;
    box-shadow: 0 0 15px var(--box_shadows_dark);
    border-radius: 5px;
    margin-top: 50px;
    color: var(--base);
    background: var(--anti_base);
    padding: 4rem 0 0 0;
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 1s, height 0.2s, width 0s;
}
.profile_component {
    margin-top: 1.5rem;
    font-size: 1.2rem;
}
.profile_headline {
    margin-top: 10px;
}
.profile_part_headline {
    position: sticky;
    top: 0;
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

img.profile_image {
    filter: grayscale(1);
    transition: all 1s, transform 0.2s, grayscale 0.75s;
}

.user_data,
.user_sums,
.add_sum {
    position: relative;
    width: 90%;
    padding: 0 2rem 2rem 2rem;
    height: calc(80vh - var(--top_margin) - 4rem);
    overflow: auto;
    scrollbar-width: thin;
}

.user_data {
    --slide_direction: -1;
}
.add_sum {
    --slide_direction: 1;
}

#edit_sums_svg {
    padding: 0.2rem;
}

#addsum_interface_button span {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.profile_top_button.active > img {
    filter: grayscale(0);
}
.profile_top_button > svg {
    background: var(--anti_base);
    fill: var(--base);
}

.profile_top_button > span {
    color: var(--base);
    background: var(--anti_base);
}
.profile_top_button.active > svg {
    background: var(--base);
    fill: var(--anti_base);
}

.profile_top_button.active > span {
    background: var(--base);
    color: var(--anti_base);
}

.profile_top_button:hover > .profile_image {
    transform: scale(1.1);
}

.change_profile_content-enter-from {
    transform: translateX(calc(10% * var(--slide_direction)));
    opacity: 0;
}
.change_profile_content-leave-to {
    transform: translateX(calc(30% * var(--slide_direction)));
    opacity: 0;
}
.change_profile_content-leave-active,
.change_profile_content-enter-active {
    transition: transform 0.4s, opacity 0.4s;
}
#search {
    width: 100%;
    height: var(--search_height);
    padding: 0 15%;
    position: relative;
    background: var(--anti_base);
    color: var(--base);
}

#search * {
    font-size: 1.1rem;
    font-weight: 600;
    background: var(--anti_base);
    color: var(--base);
}
#searchBar {
    width: 100%;
    height: 2.5rem;
    position: relative;
    margin-top: 1rem;
    padding: 0 1rem;
    outline: none;
    border: none;
    background: transparent;
    border-bottom: 2px solid #aaa;
    transition: border-color 0.2s;
}
#searchBar:focus,
#searchBar:valid {
    border-bottom-color: var(--base);
}
#searchBarLabel {
    position: absolute;
    background: transparent;
    color: #888;
    left: calc(15% + 1rem);
    top: 1.5rem;
    transition: top 0.2s, font-size 0.2s, color 0.2s, opacity 0.2s;
}
#searchBar:focus ~ #searchBarLabel,
#searchBar:valid ~ #searchBarLabel {
    top: 0.5rem;
    font-size: 0.9rem;
    color: var(--base);
    opacity: 0.5;
}
</style>