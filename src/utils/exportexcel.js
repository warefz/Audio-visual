

export default {
    exportTable(list,tHeader,filterVal,name){
        const { export_json_to_excel } = require('../excel/Export2Excel');
        require.ensure([], () => {
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader,data, name);
        })
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    /*
    importfxx(obj) {
        try{
            let _this = this;
            //let inputDOM = this.$refs.inputer;
            this.file = event.currentTarget.files[0];
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            console.log(f)
            var filename=f.name;
            var type=(filename.substr(filename.lastIndexOf("."))).toLowerCase();
            console.log(type)
            if(type!=".xls"&&type!=".xlsx")
            {
                alert("请选择格式为.xls或.xlsx的文件！");
                return false;
            }
            else{
                var reader = new FileReader();
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = "";
                    var rABS = false;
                    var pt = this;
                    var wb; 
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        console.log(e)
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for(var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if(rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), {
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                        this.da = [...outdata]
                        console.log(this.da)
                        let arr = []
                        this.da.map(v => {
                            let obj = {}
                            obj.id = v.k
                            obj.status = v.b
                            arr.push(obj)
                        })
                        console.log(arr)
                        let para = {
                            //withList: JSON.stringify(this.da)
                            withList: arr
                        }
                        _this.$message({
                            message: '导入成功',
                            type: 'success'
                        });
                        withImport(para).then(res => {
                            window.location.reload()
                        })
                    }
                    reader.readAsArrayBuffer(f);
                }
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
                return true
            }
        }
        catch(err){
            return false
        }
        
    }*/
}