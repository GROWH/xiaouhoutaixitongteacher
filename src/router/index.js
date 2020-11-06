import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/pages/Login.vue'
import Layout from '../components/pages/Layout.vue'
import Index from '../components/pages/Index.vue'
import Menu from '../components/pages/Menu.vue'
import Role from '../components/pages/Role.vue'
import User from '../components/pages/User.vue'
import Category from '../components/pages/Category.vue'
import Specs from '../components/pages/Specs.vue'
import Goods from '../components/pages/Goods.vue'
import Member from '../components/pages/Member.vue'
import Banner from '../components/pages/Banner.vue'
import Seckill from '../components/pages/Seckill.vue'
Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/login',component: Login},
        { 
            path: '/',
            component:Layout,
            children:[
                { path:'index',component:Index },
                { path:'menu',component:Menu },
                { path:'role',component:Role },
                { path:'user',component:User},
                { path:'category',component:Category },
                { path:'specs',component:Specs },
                { path:'goods',component:Goods },
                { path:'member',component:Member},
                { path:'banner',component:Banner},
                { path:'seckill',component:Seckill },
                { path:'',redirect:'index' }
            ]
        }
    ]
})

//导航守卫
router.beforeEach((to,from,next)=>{
    //判断用户有没有登录，如果没有登录，那就跳转到登录页面
    var userinfo = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : "";
    if(userinfo){
        //已登录
        if(to.path === '/login'){
            next('/');
        }else{
            if(to.path === '/index'){
                next();//执行默认路由规则
            }else{
                //根据当前访问的路由进行验证权限
                let isauth = userinfo.menus_url.find(d=>{
                    return d == to.path
                });
                if(isauth){
                    next();
                }else{
                    console.log('访问权限受限')
                }
            }
        }
    }else{
        //如果当前访问的路由规则不是登录
        if(to.path !='/login'){
            next('/login')
        }else{
            next();
        }
    }
})

export default router;
