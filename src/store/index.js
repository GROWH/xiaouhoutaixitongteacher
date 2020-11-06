import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        token: sessionStorage.getItem('token'),
        userinfo:{}
    },
    getters:{
        userinfo(state){
            state.userinfo = JSON.parse(sessionStorage.getItem("user"));
            return state.userinfo;
        }
    }
});