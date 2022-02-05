<script setup lang="ts">
</script>
<template>
    <div class="page">
        <div class="userinfo">
            <h1 id="username_hdln">{{ userName }}</h1>
        </div>
        <div class="user_detail_panel">
            <div class="infos" v-if="usersums.length > 0" v-for="sum in usersums">
                <input
                    class="user_sum_checkbox"
                    type="checkbox"
                    :name="sum.id.toString()"
                    :id="sum.id.toString()"
                    :value="sum.id"
                    v-model="checked_sums"
                />
                <label :for="sum.id.toString()" class="user_sum">
                    <div class="user_sum_info">
                        <p>{{ sum.subject_name }}</p>
                        <div
                            :class="'rat' + sum.rating.toString() + ' sumrating'"
                            :title="sum.ratingamount + ' Bewertungen'"
                        >
                            <div class="rating">{{ sum.rating }}</div>
                            <svg
                                id="rating_svg"
                                :style="'--rating_num:' + sum.rating_num.toString() + ';'"
                            >
                                <circle cx="1rem" cy="1rem" r="1rem" />
                                <circle cx="1rem" cy="1rem" r="1rem" />
                            </svg>
                        </div>
                        <p>{{ sum.sumname }}</p>
                        <p>{{ formatDate(sum.Date) }} - {{ formatTime(sum.Date) }}</p>
                    </div>
                    <transition name="show_detail_info">
                        <div class="detail_info" v-if="checked_sums.includes(sum.id)">
                            <p>Schule: {{ sum.school_name }}</p>
                            <p>Ort: {{ sum.location_name }}</p>
                            <p>Klassenstufe {{ sum.subject_year }}</p>
                        </div>
                    </transition>
                    <div class="download_container">
                        <button
                            class="download"
                            :class="sum.saccess ? 'downloadable' : 'not_downloadable'"
                            @click="download_sum(sum.id, sum.sumname)"
                            :title="sum.saccess ? 'Download' : 'No Access'"
                        >🡇</button>
                    </div>

                    <div class="rate_container">
                        <transition name="show_rating_container">
                            <div class="rate_input_container" v-if="sum.show_rating&&sum.saccess">
                                <button
                                    class="rate_input_button"
                                    v-for="rating in [1, 2, 3, 4, 5]"
                                    :value="rating"
                                    @click="rate(sum.id, rating)"
                                >☆</button>
                            </div>
                        </transition>
                        <button
                            class="rate"
                            title="Bewerten"
                            :class="sum.saccess ? 'ratable' : 'not_ratable'"
                            @click="sum.show_rating = !sum.show_rating"
                        >★</button>
                    </div>
                </label>
            </div>
            <div v-else class="no_sums">
                <h2 class="no_sums_hdln">Bisher hat dieser Creator keine Zusammenfassung hochgeladen</h2>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

interface JsonEncodedSummary {
    id: number,
    sumname: string,
    subject_name: string,
    Date: string,
    rating: number,
    subject_year: number,
    school_name: string,
    location_name: string,
    ratingamount: string,
    saccess: boolean
}

interface Summary extends Omit<JsonEncodedSummary, 'Date'> {
    Date: Date,
    rating_num: number,
    show_rating: boolean
}

interface Data {
    usersums: Summary[],
    checked_sums: number[]
}

export default defineComponent({
    data(): Data {
        return {
            usersums: [],
            checked_sums: []
        }
    },
    props: {
        id: { type: String, required: true },
        name: { type: String, required: true }
    },
    computed: {
        userID(): Number {
            return parseInt(this.id)
        },
        userName(): string {
            return this.name
        }
    },
    methods: {
        formatDate(date: Date) {
            return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })
        },
        formatTime(date: Date) {
            return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })
        },
        async initData() {
            const response = await fetch(`/api/userdetails/${this.id}/${localStorage.token}`)
            const jsonFromResponse: Array<JsonEncodedSummary> = await response.json()
            this.usersums = jsonFromResponse.map((jsonEncodedSummary) => ({ ...jsonEncodedSummary, Date: new Date(jsonEncodedSummary.Date), rating_num: jsonEncodedSummary?.rating ?? 0, show_rating: false }))
            console.log(this.usersums)
        },
        async download_sum(sum_id: number, filename: string) {
            // request to the server to check access and then send file
            var res = await fetch(`/api/getsum/${localStorage.token}/${sum_id}`)
            try {
                var js_info = await res.json()
                if (js_info && !js_info.access) {
                    alert('Not downloadable')
                }

            } catch {
                if (res.url) {
                    console.log(res.url)
                    var url = res.url
                    var element = document.createElement('a');
                    element.setAttribute('href', url);
                    element.setAttribute('download', filename);
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            }
        },
        async rate(sum_id: number, rating: number) {
            console.log(`rating sum with id: ${sum_id} - rating: ${rating}`)
            var res = await fetch('/api/ratesum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.token,
                    sum_id,
                    rating
                })
            })
            var result = await res.json()
            console.log('success', result.success)
            this.initData()

        }
    },
    created() {
    },
    watch: {
        '$route.params': {
            immediate: true,
            handler() {
                this.initData();
            }
        }
    }
})
</script>
<style scoped>
#username_hdln {
    color: var(--base);
}
.user_detail_panel {
    --download_button_width: 75px;
    position: relative;
    margin-top: var(--nav_height);
    width: 100%;
    min-height: calc(100vh - var(--nav_height));
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.infos {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
}
.userinfo {
    position: fixed;
    top: calc(var(--nav_height) + 3rem);
    width: 30vw;
    left: 35vw;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    background: var(--anti_base);
}
.profile_image {
    width: 150px;
}
.user_sum {
    --initial-height: 100px;
    position: relative;
    text-decoration: none;
    color: var(--base);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    height: var(--initial-height);
    width: 90%;
    padding: 0;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px 0 0 5px;
    /* overflow: hidden; */
    transition: background 1s, color 1s, transform 0.2s, box-shadow 0.2s,
        height 0.2s;
    font-size: 1.1rem;
    z-index: 2;
    border-radius: 5px;
}
.infos + .infos {
    margin-top: 2rem;
}
.user_sum_info,
.detail_info {
    position: absolute;
    top: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    height: var(--initial-height);
    width: 100%;
    background: transparent;
    overflow: hidden;
    transition: background 1s, color 1s, transform 0.2s, box-shadow 0.2s;
    font-weight: 800;
    font-size: 1.1rem;
}

.detail_info {
    top: var(--initial-height);
}

.user_sum_info,
.detail_info {
    margin-left: var(--download_button_width);
    margin-right: var(--download_button_width);
    width: calc(100% - var(--download_button_width) * 2);
}
.user_sum_checkbox:checked ~ .user_sum {
    height: calc(var(--initial-height) * 2);
}
.show_detail_info-leave-to,
.show_detail_info-enter-from {
    opacity: 0;
}
.show_detail_info-enter-active {
    transition: opacity 0.15s;
}

.show_detail_info-leave-active {
    transition: opacity 0.05s;
}

.user_sum_checkbox {
    display: none;
}
.user_sum:hover {
    cursor: pointer;
    transform: scale(1.01);
    box-shadow: 0 0 15px var(--box_shadows_dark);
    z-index: 8;
}
.sumrating {
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
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
#rating_svg {
    position: relative;
    width: 2.3rem;
    height: 2.3rem;
    z-index: 1;
}
#rating_svg circle {
    /* --rating_num:4.3; */
    width: 2.1rem;
    height: 2.1rem;
    fill: none;
    stroke-width: 0.2rem;
    stroke: var(--base);
    transform-origin: center;
    transform: translate(0.15rem, -0.15rem) rotateZ(-90deg);
    stroke-dasharray: 6.25rem;
    stroke-dashoffset: 6.25rem;
    transition: transform .3s, stroke-dashoffset .3s;
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
.no_sums_hdln {
    color: var(--base);
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows_dark);
    padding: 0.5rem 1rem;
    border-radius: 5px;
}
.rate_container,
.download_container {
    top: 0;
    height: 100%;
    width: var(--download_button_width);
    position: absolute;
    border-radius: 5px;
}
.rate_container {
    right: 0;
}
.download_container {
    left: 0;
}

.download,
.rate {
    position: relative;
    border-radius: 0 5px 5px 0;
    width: 100%;
    height: 100%;
    border: none;
    background: var(--anti_base);
    color: var(--base);
    font-size: 1.75rem;
}
.rate_input_container {
    --bubble_distance: 0.6rem;
    position: absolute;
    top: calc(-2.2rem - var(--bubble_distance));
    left: -5rem;
    height: 2.15rem;
    width: 10rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid var(--base);
    background: var(--anti_base);
    border-radius: 5px;
}
.rate_input_container::before {
    content: "";
    position: absolute;
    bottom: calc(-1 * var(--bubble_distance));
    left: calc(
        100% - var(--download_button_width) / 2 - var(--bubble_distance) / 2
    );
    width: 0;
    height: 0px;
    border-top: var(--bubble_distance) solid var(--base);
    border-left: var(--bubble_distance) solid transparent;
    border-right: var(--bubble_distance) solid transparent;
    background: transparent;
}
.rate_input_button {
    position: relative;
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    border: none;
    background: var(--anti_base);
    color: var(--base);
    display: grid;
    align-content: center;
    transition: all 1s, background 0.5s, color 0.5s;
}
.rate_input_button:last-child{
    border-radius: 0 4px 4px 0;
}
.rate_input_button:first-child{
    border-radius: 4px 0 0  4px;
}
.rate_input_button:hover {
    cursor: pointer;
    color: var(--anti_base);
    background: var(--base);
}
.download.downloadable:hover, .rate.ratable:hover{
    cursor: pointer;
    background: rgba(0, 189, 0, 0.534);
}
.download.not_downloadable:hover,.rate.not_ratable:hover {
    cursor: pointer;
    background: rgba(68, 68, 68, 0.534);
}
.show_rating_container-enter-from {
    opacity: 0;
    transform: translateX(-2rem);
}

.show_rating_container-leave-to{
    opacity: 0;
    transform: translateX(1rem);
}

.show_rating_container-leave-active,
.show_rating_container-enter-active {
    transition: opacity 0.4s, transform .3s;
}
</style>