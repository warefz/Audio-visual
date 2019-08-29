module.exports = {
    register(params) {
        return axios.post('/admin/register',params).then((resp)=>{
            return resp.data;
        })
    },
    getCode(params) {
        return axios.post('/admin/code',params).then((resp)=>{
            return resp.data;
        })
    },
    getReviseMailCode(params) {
        return axios.post('/admin/code',params).then((resp)=>{
            return resp.data;
        })
    },
    getBindMailCode(params) {
        return axios.post('/admin/code',params).then((resp)=>{
            return resp.data;
        })
    },
    reviseMail(params) {
        return axios.post('/admin/reviseMail',params).then((resp)=>{
            return resp.data;
        })
    },
    editMail(params) {
        return axios.post('/admin/editMail',params).then((resp)=>{
            return resp.data;
        })
    },
    login(params) {
        return axios.post('/admin/login',params).then((resp)=>{
            return resp.data;
        })
    },
    logOut(params) {
        return axios.post('/admin/logout',params).then((resp)=>{
            return resp.data;
        })
    },
    isLogin(params) {
        return axios.post('/admin/isLogin',params).then((resp)=>{
            return resp.data;
        })
    },
    editPassword(params) {
        return axios.post('/admin/editPassword',params).then((resp)=>{
            return resp.data;
        })
    },
}