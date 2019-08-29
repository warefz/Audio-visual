module.exports = {
    addToCart(params) {
        return axios.post('/purchase/addToCart',params).then((resp)=>{
            return resp.data;
        })
    },
    addToCartList(params) {
        return axios.post('/purchase/addToCartList',params).then((resp)=>{
            return resp.data;
        })
    },
    getList(params) {
        return axios.post('/purchase/getList',params).then((resp)=>{
            return resp.data;
        })
    },
    getPlainList(params) {
        return axios.post('/purchase/getPurPlainList',params).then((resp)=>{
            return resp.data;
        })
    },
    edit(params) {
        return axios.post('/purchase/edit',params).then((resp)=>{
            return resp.data;
        })
    },
    deleteById(params) {
        return axios.post('/purchase/delById',params).then((resp)=>{
            return resp.data;
        })
    },
    deleteSelected(params) {
        return axios.post('/purchase/delList',params).then((resp)=>{
            return resp.data;
        })
    },
    clean(params) {
        return axios.post('/purchase/clean',params).then((resp)=>{
            return resp.data;
        })
    },
    makeDeal(params) {
        return axios.post('/purchase/makeDeal',params).then((resp)=>{
            return resp.data;
        })
    },
    getOrder(params) {
        return axios.post('/purchase/getOrder',params).then((resp)=>{
            return resp.data;
        })
    },
    delOrderById(params) {
        return axios.post('/purchase/delOrderById',params).then((resp)=>{
            return resp.data;
        })
    },
    pay(params) {
        return axios.post('/purchase/pay',params).then((resp)=>{
            return resp.data;
        })
    },
    getOrderList(params) {
        return axios.post('/purchase/getOrderList',params).then((resp)=>{
            return resp.data;
        })
    },
    getCartCount(params) {
        return axios.post('/purchase/getCartCount',params).then((resp)=>{
            return resp.data;
        })
    },
    getUserSoldList(params) {
        return axios.post('/purchase/getUserSoldList',params).then((resp)=>{
            return resp.data;
        })
    },
    getUserSoldListByType(params) {
        return axios.post('/purchase/getUserSoldListByType',params).then((resp)=>{
            return resp.data;
        })
    },
    getSellerInfo(params) {
        return axios.post('/purchase/getSellerInfo',params).then((resp)=>{
            return resp.data;
        })
    },
}