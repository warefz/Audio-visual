module.exports = {
    editAddress(params) {
        return axios.post('/address/editAddress',params).then((resp)=>{
            return resp.data;
        })
    },
    getInfo(params) {
        return axios.post('/address/getInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    delAddress(params) {
        return axios.post('/address/delAddress',params).then((resp)=>{
            return resp.data;
        })
    },
    getList() {
        return axios.post('/address/getList').then((resp)=>{
            return resp.data;
        })
    },
    setDefault(params) {
        return axios.post('/address/setDefault',params).then((resp)=>{
            return resp.data;
        })
    },
}