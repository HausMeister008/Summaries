<script setup lang="ts">
</script>
<template>
    <div class="userinfo">
        <!-- <img
                :src="usersums.avatar ? '/src/assets/images/' + usersums.avatar : '/src/assets/images/headphones.jpg'"
                alt="profile picture"
                class="profile_image"
        />-->
        <h1 id="username_hdln">{{ userName }}</h1>
    </div>
    <div class="user_detail_panel">
        <input
                v-for="sum in usersums"
                class="user_sum_checkbox"
                type="checkbox"
                :name="sum.id.toString()"
                :id="sum.id.toString()"
            />
        <label :for="sum.id.toString()" class="user_sum" v-if="usersums.length > 0" v-for="sum in usersums">
            <div class="user_sum_info">
                <p>{{ sum.subject_name }}</p>
                <div :class="'rat' + sum.rating.toString() + ' sumrating'">
                    <div class="rating">{{ sum.rating }}</div>
                    <svg id="rating_svg" :style="userStyle">
                        <circle cx="1rem" cy="1rem" r="1rem" />
                        <circle cx="1rem" cy="1rem" r="1rem" />
                    </svg>
                </div>
                <p>{{ sum.sumname }}</p>
                <p>{{ formatDate(sum.Date) }} - {{ formatTime(sum.Date) }}</p>
            </div>
            <div class="detail_info">
                <p>Schule: {{ sum.school_name }}</p>
                <p>Ort: {{ sum.location_name }}</p>
                <p>Klassenstufe {{ sum.subject_year }}</p>
            </div>
        </label>
        <div v-else class="no_sums">
            <h2 class="no_sums_hdln">No summaries found for this user</h2>
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
}

interface Summary extends Omit<JsonEncodedSummary, 'Date'> {
    Date: Date
}

interface Data {
    usersums: Summary[];
    rating_num: number;
}

export default defineComponent({
    data(): Data {
        return {
            usersums: [],
            rating_num: 0
        }
    },
    props: {
        id: { type: Number, required: true },
        name: { type: String, required: true }
    },
    computed: {
        userID(): Number {
            return this.id
        },
        userName(): string {
            return this.name
        },
        userStyle(): string {
            return `--rating_num: ${this.rating_num}`
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
            console.log(localStorage.token)
            const response = await fetch(`/api/userdetails/${this.id}/${localStorage.token}`)
            const jsonFromResponse: Array<JsonEncodedSummary> = await response.json()
            this.usersums = jsonFromResponse.map((jsonEncodedSummary) => ({ ...jsonEncodedSummary, Date: new Date(jsonEncodedSummary.Date) }))
            this.rating_num = this.usersums[0]?.rating ?? 0

            /*
            this.usersums = (await response.json())
            this.usersums.forEach((sum) => {
                var dt = new Date(sum.Date)
                sum.Date = {
                    date: dt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }),
                }
            })
            this.rating_num = this.usersums.length>0 ? this.usersums[0].rating: 0
            */
        }
    },
    created() {
        //this.initData();
        //this.$watch(() => this.$route.params, () => this.initData())
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
// import { reactive, ref, onMounted, watch } from "vue";
// interface UserInfoProps {
//     username?: string
// }
// var userinfo: UserInfoProps = reactive({})
// function userDetails() {
//     fetch(`/api/userdetails/${computed.userID}`)
//         .then(response => { response.json() })
//         .then(res => {
//             console.log(res)
//             userinfo.username = res.username
//             console.log(userinfo)
//         })
// }
</script>
<style>
#username_hdln {
    color: var(--base);
}
.user_detail_panel {
    position: relative;
    margin-top: var(--nav_height);
    width: 100%;
    min-height: calc(100vh - var(--nav_height));
    display: flex;
    justify-content: space-around;
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
    border-radius: 5px;
    overflow: hidden;
    transition: background 1s, color 1s, transform 0.2s, box-shadow 0.2s, height .2s;
    font-size: 1.1rem;
    margin-top: 1rem;
}
.user_sum_info, .detail_info{
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
.user_sum_checkbox:checked ~ .user_sum{
    height: calc(var(--initial-height) * 2);
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
</style>