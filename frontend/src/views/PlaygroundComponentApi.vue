<template>
    <div class="page">
        <div>
            A:
            <custom-checkbox :modelValue="data.a" @update:modelValue="data.a = $event"></custom-checkbox>
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


<script lang="ts">
import { defineComponent } from 'vue'
import CustomCheckbox from '../components/CustomCheckbox.vue'

export default defineComponent({
    components: {
        CustomCheckbox
    },
    data() {
        return {
            data: {
                a: false,
                b: false,
                c: false
            }
        }
    }
})
</script>


<style scoped>
.page{
    margin-top: var(--top_margin);
}
</style>