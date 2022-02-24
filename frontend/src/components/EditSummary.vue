<script setup lang="ts">

import { onMounted, ref, reactive, Ref } from 'vue'

interface editSumProperties {
    sum_id: number,
    show: boolean
}

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
}>();

const close = () => {
    emit('update:show', false);
}

interface categories {
    sumname: string,
    location_name: string,
    school_name: string,
    subject_name: string,
    subject_year: number | string
}

const categories: categories = {
    sumname: 'Name',
    subject_name: 'Fach',
    school_name: 'Schule',
    location_name: 'Ort',
    subject_year: 'Klasse',
}

interface summary extends categories {
    id: number,
    rating: number,
    ratingamount: string,
    Date: { date: string, time: string }
}

interface arriving_sums extends summary {
    preProssessedDate: Date
}
const sum: Array<summary> = reactive([])

const delete_from_sum = ['id', 'rating', 'preProssessedDate', 'ratingamount']

async function load_sum() {
    const res = await fetch(`/api/mysums?token=${localStorage.token}&searched_sum=${props.sum_id}`)
    const result: Array<arriving_sums> = await res.json()
    sum.splice(0, sum.length, result[0])
}

const to_update: categories = reactive({
    sumname: '',
    subject_name: '',
    school_name: '',
    location_name: '',
    subject_year: '',

})

async function update() {
    var update_values: any = {}
    Object.entries(to_update).forEach(([key, value]) => {
        if (value != '') {
            update_values[key] = value
        }
    })
    console.log(update_values)
    const res = await fetch(`/api/update_sum`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                update_values: update_values,
                token: localStorage.token
            }
        )
    })
}

const props = defineProps<editSumProperties>()

onMounted(load_sum)
</script>

<template>
    <div class="sum_edit_panel">
        <button id="close_edit" @click="close()">🗙</button>
        <div class="sum_edit" v-if="sum[0]">
            <h1>Du bearbeitest: "{{ sum[0].sumname }}"</h1>
            <form @submit.prevent="update()" action="/api/update_sum" method="post">
                <div
                    class="edit_container"
                    v-for="(category, name, index) in categories"
                    :key="name"
                >
                    <label :id="name.toString()">{{ category }}: {{ sum[0][name] }}</label>
                    <input :for="name.toString()" type="text" v-model="to_update[name]" />
                </div>
                <button type="submit">Änderungen übernehmen</button>
            </form>
            <p>{{ to_update }}</p>
        </div>
    </div>
</template>

<style scoped>
.sum_edit_panel {
    position: absolute;
    width: 80%;
    height: 90%;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px;
    color: var(--base);
    padding: 2rem 0;
    top: 5%;
    left: 10%;
    /* display: grid; */
    /* grid-template-rows: 2.5rem var(--search_height) auto; */
}
#close_edit {
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    padding: 0 0 0.25rem 0;
    margin: 0;
    position: absolute;
    top: 0;
    right: 0;
    background: var(--anti_base);
    color: var(--base);
    opacity: 0.5;
    border: none;
    border-radius: 5px;
    display: grid;
    align-content: center;
    transition: 1s all, opacity 0.2s, transform 0.2s, color 0.2s;
}
#close_edit:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.1);
    background: rgba(255, 0, 0, 0.5);
    color: var(--anti_base);
}
</style>