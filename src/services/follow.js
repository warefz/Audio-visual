module.exports = {
    changeFollow(params) {
        return axios.post('/follow/changeFollow',params).then((resp)=>{
            return resp.data;
        })
    },
    getFollowList(params) {
        return axios.post('/follow/getFollowList',params).then((resp)=>{
            return resp.data;
        })
    },
    getTypes(params) {
        return axios.post('/follow/getTypes',params).then((resp)=>{
            return resp.data;
        })
    },
}