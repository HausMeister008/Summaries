
<script lang="ts" setup>
import EditSummary from './EditSummary.vue';

import { ref, reactive, watch, onMounted, Ref, toRefs} from 'vue'

export interface Properties{
    searched_sum:string
}

const props = defineProps<Properties>();

const {searched_sum} = toRefs(props)

interface summary {
    id: number,
    sumname: string,
    rating: number,
    ratingamount: string,
    Date: { date: string, time: string },
    location_name: string,
    school_name: string,
    subject_name: string,
    subject_year: number
}

interface arriving_sums extends summary{
    preProssessedDate:Date
}

const my_summaries: Array<summary> = reactive([])
const editing_sum: Ref<boolean> = ref(false)
const editing_sum_id: Ref<number> = ref(0)

async function load_sums() {
    var res = await fetch(`/api/mysums?token=${localStorage.token}&searched_sum=${encodeURIComponent(searched_sum.value)}`)
    var result:arriving_sums[] = await res.json()
    result.forEach(sum => {
        var dt = new Date(sum.preProssessedDate)
        sum.Date = {
            date: dt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }),
        }
    })
    my_summaries.splice(0, my_summaries.length, ...result)
    console.log(my_summaries)

}

async function edit_sum(id:number){
    editing_sum_id.value = id
    editing_sum.value = true
}

onMounted(load_sums)
watch(searched_sum, (n,o)=>{
    load_sums()
})
</script>

<template>
    <div class="summaries">
        <div class="summary" v-for="sum in my_summaries">
            <div class="edit_symbol" @click="edit_sum(sum.id)">
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1000 1000"
                >
                    <g>
                        <path
                            d="M649.4,206.8c-8.1-8.1-21.2-8-29.4,0.2l-66.5,66.5c0,0,0,0,0,0c0,0,0,0,0,0l-266,265.9c-0.1,0.1-0.2,0.2-0.4,0.4c-0.3,0.4-0.7,0.7-1,1.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.4,0.5-0.8,1-1.1,1.5c0,0-0.1,0.1-0.1,0.1c-0.7,1.1-1.4,2.3-1.9,3.5c0,0.1-0.1,0.2-0.1,0.3c-0.2,0.5-0.4,1-0.5,1.5l0,0.2c0,0.1-0.1,0.2-0.1,0.3l-53.6,170c-4.7,14.7,11,30.4,25.8,25.8l169.9-53.6c0.2,0,0.3-0.1,0.5-0.2l0,0c0,0,0,0,0,0c0.7-0.2,1.4-0.5,2.2-0.8c0.2-0.1,0.3-0.1,0.4-0.2c0.3-0.1,0.6-0.3,0.9-0.4c0.3-0.2,0.5-0.3,0.8-0.5c0.1-0.1,0.3-0.2,0.4-0.2c0.6-0.4,1.2-0.8,1.8-1.2c0.1,0,0.1-0.1,0.2-0.1c0.7-0.5,1.3-1.1,2-1.7l265.8-265.8c0.1-0.1,0.2-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.2-0.2l66.3-66.3c8.2-8.2,8.3-21.4,0.3-29.4L649.4,206.8z M279.9,692.9l34.3-108.8l49,25.5l25.4,49L279.9,692.9z M424.2,636.1l-26.9-51.9c-1-1.9-2.2-3.5-3.7-5c-1.5-1.5-3.1-2.7-5-3.7l-51.9-26.9l231.1-231.1l87.5,87.5L424.2,636.1z M685,375.4l-87.5-87.5l36.9-36.9l87.5,87.5L685,375.4z M500,10.1C229.4,10.1,10,229.4,10,500c0,270.6,219.4,489.9,490,489.9c270.6,0,490-219.4,490-489.9C990,229.4,770.6,10.1,500,10.1z M500,935.5c-240.5,0-435.6-195-435.6-435.5c0-240.5,195-435.5,435.6-435.5c240.5,0,435.5,195,435.5,435.5C935.5,740.5,740.6,935.5,500,935.5z"
                        />
                    </g>
                </svg>
            </div>
            <p>{{ sum.sumname }}</p>
            <p>{{ sum.subject_name }} - {{ sum.subject_year }}</p>
            <p>{{ sum.school_name }} - {{ sum.location_name }}</p>
            <p>{{ sum.Date.date }} - {{ sum.Date.time }}</p>
            <div
                :class="'rat' + sum.rating.toString() + ' sumrating'"
                :title="sum.ratingamount.toString() + (parseInt(sum.ratingamount) <= 1 ? ' Bewertung' : ' Bewertungen')"
            >
                <div class="rating">{{ sum.rating }}</div>
                <svg id="rating_svg" :style="'--rating_num:' + sum.rating.toString() + ';'">
                    <circle cx="1rem" cy="1rem" r="1rem" />
                    <circle cx="1rem" cy="1rem" r="1rem" />
                </svg>
            </div>
        </div>
        
    </div>
    <edit-summary v-if="editing_sum" v-model:show="editing_sum" v-model:sum_id="editing_sum_id"/>
</template>

<style scoped>
.summaries{
    position: relative;
}
.summary {
    font-weight: bold;
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    column-gap: 0.5rem;
    row-gap: 1rem;
    padding: 2rem 4.5rem 2rem 4.5rem;
    box-shadow: 0 0 15px var(--box_shadows);
    margin: 1rem 0 1.5rem 0;
    border-radius: 5px;
    transition: all 1s, transform .2s;
}
@media (min-width: 900px) {
    .summary {
        grid-template-columns: auto auto auto auto;
    }
}
.summary:hover{
    transform: scale(1.01);
}
.rating {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.9rem;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    z-index: 2;
}
.sumrating {
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 1rem;
}
#rating_svg {
    position: relative;
    width: 2.3rem;
    height: 2.3rem;
    z-index: 1;
}
#rating_svg circle {
    width: 2.1rem;
    height: 2.1rem;
    fill: none;
    stroke-width: 0.2rem;
    stroke: #000;
    transform-origin: center;
    transform: translate(0.15rem, -0.15rem) rotateZ(-90deg);
    stroke-dasharray: 6.25rem;
    stroke-dashoffset: 6.25rem;
}
#rating_svg circle:nth-child(1) {
    stroke: #f3f3f3;
    stroke-dashoffset: 0;
}
#rating_svg circle:nth-child(2) {
    stroke: #23cf00;
    stroke-dashoffset: calc(
        6.25rem - (6.25rem * calc(100 * (var(--rating_num)) / 5) / 100)
    );
}
.edit_symbol{
    position: absolute;
    left: 1rem;
}
.edit_symbol > svg{
    width: 3rem;
    fill: var(--base);
    background-color: var(--anti_base);
    border-radius:5px;
    transition: all 1s, background .5s, fill .5s;
    padding: 0.25rem;
}
.edit_symbol:hover{
    cursor: pointer;
}
.edit_symbol:hover> svg{
    fill: var(--anti_base);
    background-color: var(--base);
}
</style>