<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'

const adding_sum = ref(false)
const subject_inpt = ref('')
const school_inpt = ref('')
const sum_name_inpt = ref('')

interface subject{
    name: string,
    id: number
}

interface options {
    subjects: subject[],
    schools: string[]
}

var options: options = reactive({
    subjects: [],
    schools: [],
})

async function load_data() {
    const res = await fetch(`/api/addSumValues/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            subject: subject_inpt.value,
            school: school_inpt.value
        })
    })
    const result: options = await res.json()
    // result = {
    //     subjects: ['Informatik', 'Sport'],
    //     schools: ['Kant-Gymnasium Weil am Rhein']
    //   }
    // adding all the options to options
    options = Object.assign(options, result)

}

onMounted(load_data)

watch(subject_inpt, (old_sub, new_sub) => {
    load_data()
})
watch(school_inpt, (old_school, new_school) => {
    load_data()
})

</script>

<template>
    <div
        class="add_summary"
        :style="adding_sum
        ? 'box-shadow:0 0 15px var(--box_shadows);--scale: 1;'
        : 'box-shadow:none;--scale: 0;'"
    >
        <input v-model="adding_sum" type="checkbox" name="add_sum" id="add_sum" />
        <label for="add_sum" id="add_sum_label">
            <span>{{ adding_sum ? '-' : '+' }}</span> Zusammenfassung hinzufügen
        </label>
        <div id="adding_sum_container">
            <form id="create_sum_form">
                <div class="dropdown_menu">
                    <select
                        name="subject"
                        id="select_subject_dropdown"
                        class="dropdown_input"
                        v-model="subject_inpt"
                    >
                        <option value selected disabled>Fachauswahl</option>
                        <option v-for="subject in options.subjects" :value="subject.id">{{ subject.name }}</option>
                    </select>
                </div>
                <div class="dropdown_menu">
                    <select
                        name="school"
                        id="select_school_dropdown"
                        class="dropdown_input"
                        v-model="school_inpt"
                    >
                        <option value selected disabled>Schule</option>
                        <option v-for="school in options.schools" :value="school">{{ school }}</option>
                    </select>
                </div>
                <div class="sum_inpt_group">
                    <input
                        v-model="sum_name_inpt"
                        name="sum_name_inpt"
                        id="sum_name_inpt"
                        class="sum_inpt"
                        type="text"
                        required
                        autocomplete="off"
                    />
                    <label class="sum_inpt_label" for="sum_name_inpt">Name der Zusammenfassung</label>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.add_summary {
    --pad: calc(var(--scale) * 2rem);
    transition: background 1s, color 1s, box-shadow 0.2s, padding 0.2s,
        height 0.5s;
    border-radius: 5px;
    padding: var(--pad);
    height: calc(var(--scale) * 100%);
}
#add_sum {
    display: none;
}
#add_sum_label span {
    font-weight: 900;
    padding: 0 0.5em;
    border-radius: 5px;
    transition: background 0.2s, color 0.2s;
}
#add_sum_label:hover {
    cursor: pointer;
}
#add_sum_label:hover span {
    background: var(--base);
    color: var(--anti_base);
}
#adding_sum_container {
    transition: background 1s, color 1s, box-shadow 0.2s, transform 0.4s;
    transform: scale(var(--scale));
    /* transform-origin: top; */
}

.sum_inpt {
    width: 100%;
    border: none;
    outline: none;
    border-bottom: #aaa 2px solid;
    padding: 0 0.5rem;
    transition: border-bottom-color 0.2s;
    color: var(--base);
}
.sum_inpt:focus,
.sum_inpt:valid {
    border-bottom-color: var(--base);
}
.sum_inpt_group {
    width: 50%;
    min-width: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.sum_inpt_group * {
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
}
.sum_inpt_group {
    margin-top: 1.2rem;
}

.sum_inpt_label {
    position: absolute;
    color: #777;
    left: 0.5rem;
    top: 0;
    pointer-events: none;
    transition: top 0.2s ease-in-out, font-size 0.2s ease-in-out, color 0.2s,
        opacity 0.2s;
}
.sum_inpt:focus ~ .sum_inpt_label,
.sum_inpt:valid ~ .sum_inpt_label {
    top: -1.1em;
    font-size: 0.75em;
    color: var(--base);
    opacity: 0.5;
}
.dropdown_menu {
    margin-top: 1.2rem;
}
.dropdown_menu select {
    font-size: 0.9rem;
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
    font-size: 0.9rem;
    text-align: center;
    background: var(--anti_base);
    color: var(--base);
}
.dropdown_menu option[selected] {
    background: var(--base);
    color: var(--anit_base);
}
</style>