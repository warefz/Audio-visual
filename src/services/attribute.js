module.exports = {
    getList() {
        return axios.post('/attribute/getList').then((resp)=>{
            return resp.data;
        })
    }
}