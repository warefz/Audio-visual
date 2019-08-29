module.exports = {
    getBaseInfo(params) {
        return axios.post('/userInfo/getBaseInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    getSomeInfo(params) {
        return axios.post('/userInfo/getSomeInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    getShoppingInfo(params){
        return axios.post('/userInfo/getShoppingInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    getShoppingList(params){
        return axios.post('/userInfo/getShoppingList',params).then((resp)=>{
            return resp.data;
        })
    },
    editInfo(params) {
        return axios.post('/userInfo/editInfo',params).then((resp)=>{
            return resp.data;
        })
    }
}