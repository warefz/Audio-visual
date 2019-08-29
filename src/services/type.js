module.exports = {
    getRootType() {
        return axios.post('/type/getRootType').then((resp)=>{
            return resp.data;
        })
    },
    getTypes(params) {
        return axios.post('/type/getTypes',params).then((resp)=>{
            return resp.data;
        })
    },
    getList() {
        return axios.post('/type/getList').then((resp)=>{
            return resp.data;
        })
    },
    typeRoute(params){
        return axios.post('/type/typeRoute',params).then((resp)=>{
            return resp.data;
        })
    },
    getHotTypes(params){
        return axios.post('/type/getHotTypes',params).then((resp)=>{
            return resp.data;
        })
    },
}