<script setup lang="ts">

import { onMounted, ref, reactive, Ref, watch } from 'vue'

interface editSumProperties {
    sum_id: number,
    show: boolean,
    changed: number
}

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'update:changed', value: number): void;
}>();

const close = () => {
    emit('update:show', false);
}

interface categories {
    sumname: string,
    school_name: string,
    subject?: number | string // subject id
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

const update_inpt_form = ref()

async function load_sum() {
    const res = await fetch(`/api/mysums?token=${localStorage.token}&searched_sum=${props.sum_id}`)
    const result: Array<arriving_sums> = await res.json()
    sum.splice(0, sum.length, result[0])
}

const initial_state: categories = {
    sumname: '',
    school_name: '',
    subject: ''
}

const to_update: categories = reactive({ ...initial_state })

async function update() {
    var update_values: any = {}
    Object.entries(to_update).forEach(([key, value]) => {
        if (value != '') {
            update_values[key] = value
        }
    })
    to_update.sumname = ''
    const res = await fetch(`/api/update_sum`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                subject: update_values.subject,
                sumname: update_values.sumname,
                token: localStorage.token,
                sum_id: props.sum_id
            }
        )
    })
    emit('update:changed', props.changed + 1);
    load_sum()
}
interface subject {
    name: string,
    id: number,
    year: number
}

interface school {
    name: string,
    location: string
}

interface options {
    subjects: subject[],
    schools: school[]
}

const options: options = reactive({
    subjects: [],
    schools: [],
})

async function get_dropdown_options() {
    const res = await fetch(`/api/SumValues/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject: to_update.subject,
            school: to_update.school_name
        })
    })
    const result: options = await res.json()
    Object.assign(options, result)

}

const props = defineProps<editSumProperties>()

onMounted(() => {
    load_sum()
    get_dropdown_options()
})

</script>

<template>
    <div class="sum_edit_panel">
        <button id="close_edit" @click="close()">🗙</button>
        <div class="sum_edit" v-if="sum[0]">
            <h1>Du bearbeitest: "{{ sum[0].sumname }}"</h1>
            <form
                @submit.prevent="update()"
                action="/api/update_sum"
                method="post"
                ref="update_inpt_form"
                id="edit_sum_form"
            >
                <div class="edit_container">
                    <input
                        :data_value="to_update.sumname"
                        for="name_edit"
                        type="text"
                        v-model="to_update.sumname"
                        class="edit_inpt"
                    />
                    <label id="name_edit" class="edit_inpt_label">Name: {{ sum[0].sumname }}</label>
                </div>
                <div class="dropdown_menu edit_container">
                    <select
                        name="subject"
                        id="select_subject_dropdown"
                        class="dropdown_input"
                        v-model="to_update.subject"
                        @change="get_dropdown_options"
                    >
                        <option value selected>Fachauswahl (kein Fach ausgewählt)</option>
                        <option
                            v-for="subject in options.subjects"
                            :value="subject.id"
                        >{{ subject.name }} (Klasse {{ subject.year }})</option>
                    </select>
                </div>
                <div class="dropdown_menu edit_container">
                    <select
                        name="school"
                        id="select_school_dropdown"
                        class="dropdown_input"
                        @change="get_dropdown_options"
                        v-model="to_update.school_name"
                    >
                        <option value selected>Schule (keine Schule ausgewählt)</option>
                        <option
                            v-for="school in options.schools"
                            :value="school.name"
                        >{{ school.name }} ({{ school.location }})</option>
                    </select>
                </div>
                <button type="submit" id="submitChanges">Änderungen übernehmen</button>
            </form>
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
    top:15px; /*enough space for box shadow*/
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
#edit_sum_form {
    display: grid;
    justify-content: center;
    align-content: center;
    flex-direction: column;
}
.edit_container {
    width: 50%;
    min-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid transparent;
    border-radius: 5px;
    position: relative;
}
.edit_container * {
    font-size: 1.2rem;
    font-weight: 600;
    background: transparent;
}
.edit_container {
    margin-top: 1.2rem;
}
.edit_inpt {
    width: 100%;
    border: none;
    outline: none;
    border-bottom: #aaa 2px solid;
    padding: 0 0.5rem;
    transition: border-bottom-color 0.2s;
    color: var(--base);
}
.edit_inpt:focus,
.edit_inpt[data_value]:not([data_value=""]) {
    border-bottom-color: var(--base);
}
.edit_inpt ~ .edit_inpt_label {
    position: absolute;
    color: #777;
    left: 0.5rem;
    top: 0;
    pointer-events: none;
    transition: top 0.2s ease-in-out, font-size 0.2s ease-in-out, color 0.2s,
        opacity 0.2s;
}
.edit_inpt:focus ~ .edit_inpt_label,
.edit_inpt[data_value]:not([data_value=""]) ~ .edit_inpt_label {
    top: -1.1em;
    font-size: 0.75em;
    color: var(--base);
    opacity: 0.5;
}
.dropdown_menu {
    margin-top: 1.2rem;
}
.dropdown_menu select {
    font-size: 1rem;
    height: 2em;
    text-align: center;
    width: 100%;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px var(--box_shadows);
    background-color: var(--anti_base);
    color: var(--base);
}
.dropdown_menu option {
    font-size: .9rem;
    text-align: center;
    background: var(--anti_base);
    color: var(--base);
}
.dropdown_menu option[selected] {
    background: var(--base);
    color: var(--anit_base);
}
#submitChanges{
    margin-top: 2rem;
    font-size: 1.2rem;
    border: none;
    padding: .5rem;
    background: var(--anti_base);
    color: var(--base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px;
    transition: all 1s, transform .2s;
}
#submitChanges:hover{
    cursor: pointer;
    transform: scale(1.05);
}
</style>