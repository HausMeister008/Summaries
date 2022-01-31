<template>
    <div class="page">
        <div>
            <!-- https://v3.vuejs.org/guide/migration/v-model.html#v-model-arguments -->
            <custom-checkbox v-model="data.a" v-model:label="data.aLabel"></custom-checkbox>
        </div>
        <div>
            B:
            <custom-checkbox v-model="data.b"></custom-checkbox>
        </div>
        <div>
            C:
            <custom-checkbox v-model="data.c"></custom-checkbox>
        </div>
        <div>{{ data }}</div>
    </div>
</template>


<script setup lang="ts">
import { reactive } from 'vue'
import CustomCheckbox from '../components/CustomCheckbox.vue'

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