<script setup lang="ts">
import { ref, watch, onMounted, reactive, Ref } from 'vue'
import throttle from 'lodash/throttle';

import CustomCheckbox from '../components/CustomCheckbox.vue'

const adding_sum = ref(false)
const subject_inpt = ref('')
const school_inpt = ref('')
const sum_name_inpt = ref('')
const sum_restricted_access_inpt = ref(false)
var dragover_file_area = ref(false)
var dropped_file_successfully = ref(false)
const file = ref()
const file_count = ref(0)
const progress = ref(0)
const form: Ref<HTMLFormElement | undefined> = ref()

interface subject {
    name: string,
    id: number
}

interface options {
    subjects: subject[],
    schools: string[]
}

const options: options = reactive({
    subjects: [],
    schools: [],
})

const props = defineProps<{
    showRestricUsers: boolean,
    addusers: number[]
}>();

const emit = defineEmits<{
    (e: 'update:showRestricUsers', value: boolean): void;
}>();

const onClick = () => {
    emit('update:showRestricUsers', props.showRestricUsers);
}
const addAdditionalUsers = async () => {
    await emit('update:showRestricUsers', false);
    emit('update:showRestricUsers', true);

}
async function load_data() {
    const res = await fetch(`/api/SumValues/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    Object.assign(options, result)
}


async function submitSum() {
    console.log('submitting sum', form.value)
    const fd = new FormData(form.value)
    console.log('restrict', props.showRestricUsers)
    fd.set('restrict', JSON.stringify(props.showRestricUsers))
    fd.append('usertoken', localStorage.token)
    fd.append('addusers', JSON.stringify(props.addusers))
    var ajaxRequest = new XMLHttpRequest()

    ajaxRequest.upload.addEventListener(
        'progress', throttle((event) => {
            var prgrs = event.loaded / event.total
            progress.value = Math.round(prgrs * 100)
            console.log('making progress', progress.value)
        }, 1000, { leading: true, trailing: true })
    )

    ajaxRequest.addEventListener('load', async (event) => {
        console.log('upload complete')
        if (ajaxRequest.status == 200) {
            form.value?.reset()
            emit('update:showRestricUsers', false);
        } else {
            window.alert("Sth went wrong... Try again later")
        }
        if (file.value) {
            file.value.files = null
            file_count.value = file.value.files.length
        }
        setTimeout(() => {
            progress.value = 0
        }, 1000)
    })
    ajaxRequest.open('POST', '/api/upload_sum')
    ajaxRequest.send(fd)

}

async function handlefile() {
    console.log('handling file:', file.value.files.length, file.value.files)
    file_count.value = file.value.files.length
}

async function dragenter() {
    if (!dragover_file_area.value) {
        dragover_file_area.value = true
        console.log('dragenter:', dragover_file_area.value)
    }
}
async function dragleave() {
    if (dragover_file_area.value) {
        dragover_file_area.value = false
        console.log('dragleave:', dragover_file_area.value)
    }
}
async function dropped_file(e: DragEvent) {
    dragover_file_area.value = false
    // e.preventDefault()
    var dropped_files = e.dataTransfer?.files.length == 1 ? e.dataTransfer.files : []
    if (dropped_files) {
        console.log('dropped file', dropped_files)
        file.value.files = dropped_files
        dropped_file_successfully.value = true
        handlefile()
    }
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
            <form
                id="create_sum_form"
                action="/api/upload_sum"
                method="post"
                ref="form"
                enctype="multipart/form-data"
                @submit.prevent="submitSum()"
            >
                <div class="dropdown_menu">
                    <select
                        name="subject"
                        id="select_subject_dropdown"
                        class="dropdown_input"
                        v-model="subject_inpt"
                        required
                    >
                        <option value selected>Fachauswahl (kein Fach ausgewählt)</option>
                        <option
                            v-for="subject in options.subjects"
                            :value="subject.id"
                        >{{ subject.name }}</option>
                    </select>
                </div>
                <div class="dropdown_menu">
                    <select
                        name="school"
                        id="select_school_dropdown"
                        class="dropdown_input"
                        required
                        v-model="school_inpt"
                    >
                        <option value selected>Schule (keine Schule ausgewählt)</option>
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
                <div class="sum_inpt_group">
                    <custom-checkbox
                        @click="onClick"
                        v-model="showRestricUsers"
                        label="Zugriff einschränken"
                    />
                    <span id="adduseramount" v-if="addusers">({{ addusers.length }})</span>
                    <button id="open_access_user_window" @click.prevent="addAdditionalUsers">+</button>
                </div>
                <div
                    class="sum_inpt_group"
                    :class="
                        dragover_file_area ? 'dragover' : dropped_file_successfully ? 'dropped' : ''
                    "
                    @dragover.prevent
                    @dragenter="dragenter"
                    @dragleave="dragleave"
                    @drop.prevent="dropped_file($event)"
                >
                    <input
                        ref="file"
                        name="sum_file_inpt"
                        id="sum_file_inpt"
                        class="sum_inpt_file"
                        type="file"
                        required
                        autocomplete="off"
                        @change="handlefile"
                    />
                    <label class="file_upload_icon" for="sum_file_inpt">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>Browse Files</title>
                            <path
                                d="M 6 2 C 4.9057453 2 4 2.9057453 4 4 L 4 20 C 4 21.094255 4.9057453 22 6 22 L 18 22 C 19.094255 22 20 21.094255 20 20 L 20 8 L 14 2 L 6 2 z M 6 4 L 13 4 L 13 9 L 18 9 L 18 20 L 6 20 L 6 4 z"
                            />
                        </svg>
                        <div class="file_count" v-if="file_count > 0">{{ file_count }}</div>
                    </label>
                </div>
                <div class="sum_inpt_group">
                    <input type="submit" value="Senden" id="submitSum" />
                    <label
                        for="submitSum"
                        id="SubmitSumLabel"
                        :style="`--progress:${progress};`"
                    >Senden</label>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
#sum_file_inpt {
    display: none;
    transform: scale(0);
}
.dragover {
    border-color: var(--base) !important;
}
.dropped {
    border-color: rgb(60, 255, 0) !important;
}
.file_upload_icon {
    width: 50px;
    height: 50px;
    fill: var(--base);
    /* stroke-linecap: round;
    stroke-linejoin: round; */
    transition: background 1s, color 1s, box-shadow 0.2s, transform 0.2s,
        fill 0.2s;
}
.file_upload_icon:hover {
    cursor: pointer;
    transform: scale(1.1);
}
.file_count {
    position: absolute;
    top: 15px;
    left: calc(50% - 5px);
}
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

.sum_inpt_group {
    width: 50%;
    min-width: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid transparent;
    border-radius: 5px;
    position: relative;
}
.sum_inpt_group * {
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
}
.sum_inpt_group {
    margin-top: 1.2rem;
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
#submitSum {
    display: none;
}
#SubmitSumLabel {
    --progress: 0;
    border: none;
    color: var(--base);
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin: 1rem 0 0 0;
    box-shadow: 0 0 5px var(--box_shadows);
    font-weight: 900;
    font-size: 1rem;
    position: relative;
    overflow: hidden;
}
#SubmitSumLabel:hover {
    cursor: pointer;
}
#SubmitSumLabel::before {
    content: "";
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 172, 0, 0.788);
    transform-origin: left;
    transform: scaleX(calc(var(--progress) / 100));
    transition: transform 0.5s ease-in-out;
}

#adduseramount {
    background: var(--anit_base);
    color: var(--base);
    margin: 0 0 0 0.2rem;
}
#open_access_user_window {
    background: var(--anit_base);
    color: var(--base);
    border: 1px solid var(--base);
    border-radius: 5px;
    margin: 0 0 0 1rem;
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    align-content: center;
    outline: none;
    transition: all 1s, background 0.5s, color 0.5s;
}
#open_access_user_window:hover {
    cursor: pointer;
    background: var(--base);
    color: var(--anti_base);
}
</style>