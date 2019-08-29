module.exports = {
    getRootList(params) {
        return axios.post("/tip/getRootTips",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getList(params) {
        return axios.post("/tip/getList",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getTip(params) {
        return axios.post("/tip/getTip",params)
        .then((resp) => {
            return resp.data;
        });
    },
    tipRoute(params) {
        return axios.post("/tip/tipRoute",params)
        .then((resp) => {
            return resp.data;
        });
    },
}