module.exports = {
    getSoldList(params) {
        return axios.post('/order/getSoldList',params).then((resp)=>{
            return resp.data;
        })
    },
    getOrderList(params) {
        return axios.post('/order/getOrderList',params).then((resp)=>{
            return resp.data;
        })
    },
    getOrder(params) {
        return axios.post('/order/getOrder',params).then((resp)=>{
            return resp.data;
        })
    },
    getSoldItem(params) {
        return axios.post('/order/getSoldItem',params).then((resp)=>{
            return resp.data;
        })
    },
    getBuyItem(params) {
        return axios.post('/order/getBuyItem',params).then((resp)=>{
            return resp.data;
        })
    },
    sendCommodity(params) {
        return axios.post('/order/sendCommodity',params).then((resp)=>{
            return resp.data;
        })
    },
    sendOrder(params) {
        return axios.post('/order/sendOrder',params).then((resp)=>{
            return resp.data;
        })
    },
    confirmReceive(params) {
        return axios.post('/order/confirmReceive',params).then((resp)=>{
            return resp.data;
        })
    },
    delFromZOrder(params) {
        return axios.post('/order/delFromZOrder',params).then((resp)=>{
            return resp.data;
        })
    },
}