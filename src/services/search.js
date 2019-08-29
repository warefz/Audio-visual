module.exports = {
    getHotSearch(params) {
        return axios.post('/search/getHotSearch',params).then((resp)=>{
            return resp.data;
        })
    },
    searchByName(params) {
        return axios.post('/search/searchByName',params).then((resp)=>{
            return resp.data;
        })
    },
    getList(params) {
        return axios.post('/search/getList',params).then((resp)=>{
            return resp.data;
        })
    },
    cleanSearch(params) {
        return axios.post('/search/clean',params).then((resp)=>{
            return resp.data;
        })
    },
}