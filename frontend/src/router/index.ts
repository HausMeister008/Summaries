import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

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
        component: ()=>import('../views/Login.vue')
    },
    {
        path: '/user/:id/:name',
        name: 'UserDetails',
        component: ()=>import('../views/UserDetails.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router