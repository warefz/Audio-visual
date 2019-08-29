const uploadUrl = '/upload/upload/';
const compressUpload = '/image/compressUpload/';

export default {
    normal(file) {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post(uploadUrl, formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }).then((resp) => {
            return resp.data;
        })
    },
    compress(file){
        let formData = new FormData();
        formData.append('file', file);
        return axios.post(compressUpload, formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((resp) => {
            console.log("file resp", resp)
            return resp.data.data;
        })
    }

}