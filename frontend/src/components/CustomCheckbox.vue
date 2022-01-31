<template>
    <div class="checkbox_input_group" @click="onClick()">
        <input
            type="checkbox"
            :checked="modelValue"
            class="checkbox_input"
        />
        <label class="checkbox_label" >{{ label??'Checkbox' }}</label>
    </div>
</template>



<script lang="ts" setup>
const props = defineProps<{
    modelValue?: boolean
    label?: string
    arrayElement?: string | number
    array?: Array<string | number>  
}>();

// 
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update:label', value: string | undefined): void;
    // work on reactive array
    (e: 'update:array', value: boolean[]): void;
    (e: 'checked'): void;
    (e: 'unchecked'): void
}>();

const onClick = () => {
    emit('update:label', props.label?.split('').reverse().join(''));
    emit('update:modelValue', !props.modelValue)
    if (props.array && props.arrayElement) {
        const neuesArray = [...props.array]
        if (neuesArray.includes(props.arrayElement)) {
            // ist schon drin! Was nun?
            // emit('update:array', neuesArray)
        } else {
            // ist noch nicht drin! Was nun
            // emit('update:array', neuesArray)
        }
    }
}
</script> 

<style scoped>

.checkbox_input_group {
    justify-content: left;
    align-items: center;
}
.checkbox_input {
    display: none;
    outline: none;
    margin: 0 0.5rem;
}
.checkbox_input:checked {
    background: var(--base);
    color: var(--anti_base);
}
.checkbox_input:hover {
    cursor: pointer;
    transform: scale(1.1);
}
.checkbox_label {
    padding-left: 2em;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.checkbox_label::before {
    content: "\2713";
    font-size: 0.8em;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0.5em;
    width: 1rem;
    height: 1rem;
    background: var(--anti_base);
    color: var(--anti_base);
    border-radius: 5px;
    border: 1px solid var(--base);
    transition: color 0.5s, background 1s;
}
.checkbox_input:checked ~ .checkbox_label::before {
    color: var(--base);
}
</style>