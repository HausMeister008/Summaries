<template>
    <div class="page">
        
        <custom-checkbox arrayElement="1" v-model:array="data_array" label="Place1"></custom-checkbox>
        <custom-checkbox arrayElement="2" v-model:array="data_array" label="Place2"></custom-checkbox>
        <br>
        <div>
            C:
            <custom-checkbox v-model="data.c"></custom-checkbox>
        </div>
        <div>{{ data }}</div>
        <div>{{ data_array }}</div>
    </div>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue'
import CustomCheckbox from '../components/CustomCheckbox.vue'

const data_array = ref([])

const data = reactive({
    aLabel: 'Hier ist A',
    a: false,
    b: false,
    c: false
})
</script>


<style scoped>
.page{
    margin-top: var(--nav_height);
}
</style>