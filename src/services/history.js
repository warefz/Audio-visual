module.exports = {
    getList(params) {
        return axios.post('/history/getBrowseHistory',params).then((resp)=>{
            return resp.data;
        })
    },
    getBrowseByDay(params) {
        return axios.post('/history/getBrowseHistoryByDay',params).then((resp)=>{
            return resp.data;
        })
    },
    delBrowseHistoryById(params) {
        return axios.post('/history/delBrowseHistoryById',params).then((resp)=>{
            return resp.data;
        })
    },
    getTypes(params) {
        return axios.post('/history/getTypes',params).then((resp)=>{
            return resp.data;
        })
    },
    delBrowseHistory(params) {
        return axios.post('/history/delBrowseHistory',params).then((resp)=>{
            return resp.data;
        })
    }
}