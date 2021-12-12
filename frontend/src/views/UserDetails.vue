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
        <div class="user_sum" v-if="usersums.length > 0" v-for="sum in usersums">
            <p>{{ sum.Subject }}</p>
            <div :class="'rat' + sum.rating.toString() + ' sumrating'">
                <div class="rating">{{ sum.rating }}</div>
                <svg id="rating_svg" :style="userStyle">
                    <circle cx="1rem" cy="1rem" r="1rem" />
                    <circle cx="1rem" cy="1rem" r="1rem" />
                </svg>
            </div>
            <p>{{ sum.sumname }}</p>
            <p>{{ sum.Date.date }} - {{ sum.Date.time }}</p>
        </div>
        <div v-else class="no_sums">
            <h2 class="no_sums_hdln">No summaries found for this user</h2>
        </div>
    </div>
</template>
<script lang="ts">
interface summaries {
    sumname: string,
    Subject: string,
    Date: { date: Date, time: Date },
    rating: number
}
export default {
    data() {
        let usersums: Array<summaries> = []
        let rating_num: number = 0
        return {
            usersums,
            rating_num
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
        userStyle(): { '--rating_num': number } {
            return {
                '--rating_num': this.rating_num
            }
        }
    },
    methods: {
        async initData() {
            const response = await fetch(`/api/userdetails/${this.id}`)
            this.usersums = await response.json()
            this.usersums.forEach((sum) => {
                var dt = new Date(sum.Date)
                sum.Date = {
                    date: dt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }),
                }
            })
            this.rating_num = this.usersums[0].rating
        }
    },
    async created() {
        this.initData();
        this.$watch(() => this.$route.params, async () => this.initData)
    }
}
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
#username_hdln{
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
    text-decoration: none;
    color: var(--base);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    height: 100px;
    width: 90%;
    margin-left: 5%;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    padding: 0 2rem 0 0;
    border-radius: 5px;
    overflow: hidden;
    transition:background 1s, color 1s, transform 0.2s, box-shadow 0.2s;
    font-weight: 800;
    font-size: 1.1rem;
    margin-top: 1rem;
}
.user_sum:hover {
    transform: scale(1.01);
    box-shadow: 0 0 15px var(--box_shadows_dark);
    cursor: pointer;
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
</style>