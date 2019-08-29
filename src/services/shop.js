module.exports = {
    getInfo(params) {
        return axios.post('/shop/getInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    getTypes(params) {
        return axios.post('/shop/getTypes',params).then((resp)=>{
            return resp.data;
        })
    },
    edit(params) {
        return axios.post('/shop/edit',params).then((resp)=>{
            return resp.data;
        })
    },
    getSoldList(params) {
        return axios.post('/shop/getSoldList',params).then((resp)=>{
            return resp.data;
        })
    },
    getPurchasedList(params) {
        return axios.post('/shop/getPurchasedList',params).then((resp)=>{
            return resp.data;
        })
    },
}