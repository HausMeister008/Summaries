import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import UserProfile from '../views/UserProfile.vue'
import LoginRegister from '../views/LoginRegister.vue'

const routes =[
    {
        path: '/',
        name: 'Home',
        component: Home
    },{
        path: '/selection',
        name: 'UserSelection',
        // lazy-loading - loaded only if requested
        component: ()=>import('../views/UserSelection.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginRegister
    },
    {
        path: '/user/:id/:name',
        name: 'UserDetails',
        component: ()=>import('../views/UserDetails.vue'),
        props: true
    },
    {
        path: '/userprofile',
        name: 'UserProfile',
        component: ()=>import('../views/UserProfile.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router