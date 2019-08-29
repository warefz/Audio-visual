module.exports = {
    edit(params) {
        return axios.post('/evaluate/edit',params).then((resp)=>{
            return resp.data;
        })
    },
    getById(params) {
        return axios.post('/evaluate/getById',params).then((resp)=>{
            return resp.data;
        })
    },
    delById(params) {
        return axios.post('/evaluate/delById',params).then((resp)=>{
            return resp.data;
        })
    },
}