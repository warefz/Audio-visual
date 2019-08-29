module.exports = {
    createCommodity(params) {
        return axios.post('/commodity/create',params).then((resp)=>{
            return resp.data;
        })
    },
    editCommodity(params) {
        return axios.post('/commodity/edit',params).then((resp)=>{
            return resp.data;
        })
    },
    delById(params) {
        return axios.post('/commodity/delById',params).then((resp)=>{
            return resp.data;
        })
    },
    getList(params) {
        return axios.post('/commodity/getList',params).then((resp)=>{
            return resp.data;
        })
    },
    getInfo(params) {
        return axios.post('/commodity/getInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    setChecked(params) {
        return axios.post('/commodity/setChecked',params).then((resp)=>{
            return resp.data;
        })
    },
    getHotSell(params) {
        return axios.post('/commodity/getHotSell',params).then((resp)=>{
            return resp.data;
        })
    },
    getHotSellTDays(params) {
        return axios.post('/commodity/getHotSellTDays',params).then((resp)=>{
            return resp.data;
        })
    },
    getHotView(params) {
        return axios.post('/commodity/getHotView',params).then((resp)=>{
            return resp.data;
        })
    },
    getCartList(params) {
        return axios.post('/commodity/getCartList',params).then((resp)=>{
            return resp.data;
        })
    },
    getHomePlainList(params) {
        return axios.post('/hot/getHomePlainList',params).then((resp)=>{
            return resp.data;
        })
    },
    getHomeTypesHotList(params) {
        return axios.post('/hot/getHomeTypesHotList',params).then((resp)=>{
            return resp.data;
        })
    },
    getComments(params) {
        return axios.post('/commodity/getComments',params).then((resp)=>{
            return resp.data;
        })
    },
    getSomeRecommend(params) {
        return axios.post('/commodity/getSomeRecommend',params).then((resp)=>{
            return resp.data;
        })
    },
    getPersonalRec(params){
        return axios.post('/commodity/getPersonalRec',params).then((resp)=>{
            return resp.data;
        })
    },
    getSimilarCom(params){
        return axios.post('/commodity/getSimilarCom',params).then((resp)=>{
            return resp.data;
        })
    },
}