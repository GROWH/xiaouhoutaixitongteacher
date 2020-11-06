import axios from 'axios';
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';
const token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
/**
 * 封装get方法
 * @param url
 * @param params
 */
function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url:url, 
            method:'get',
            baseURL:axios.defaults.baseURL,
            // baseURL:'https://api.zhaowei.shop',
            params,
            headers: { 'Authorization': token },//设置header信息
        }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
            url, 
            method:'post',
            baseURL:axios.defaults.baseURL,
            // baseURL:'https://api.zhaowei.shop',
            data,
            headers: { 'Authorization': token },//设置header信息
        }).then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        });
    });
}
export { get, post }