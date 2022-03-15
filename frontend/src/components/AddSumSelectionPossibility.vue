<script lang="ts" setup>
import {ref} from 'vue'


const props = defineProps<{
    toChangeName:string, 
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
}>();

function close(){
    emit('update:show', false)
}

</script>

<template>
<div class="addValContainer">
    <button id="closeContainer" @click="close">🗙</button>
    <h1>{{props.toChangeName}} Hinzufügen</h1>
    <h3>Funktion noch nicht ausgearbeitet</h3>
</div>
</template>

<style scoped>
.addValContainer{
    top: 5%;
    position:absolute;
    width: 90%;
    height: 90%;
    margin-inline: auto;
    background: var(--anti_base);
    color: var(--base);
    box-shadow: 0 0 15px var(--box_shadows);
}
#closeContainer{
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
#closeContainer:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.1);
    background: rgba(255, 0, 0, 0.5);
    color: var(--anti_base);
}
</style>