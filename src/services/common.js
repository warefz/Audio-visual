
import moment from "moment";
export default{
    formattime(time) {
        return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
}