const fs = require("fs");
const request = require("request");

//전역상수
global.MUI = {
    GATEWAY_PORT: "9000",
    GATEWAY_IP: "127.0.0.1",
    GATEWAY_IP_PORT: "127.0.0.1:9000",
    GATEWAY_URI: "http://127.0.0.1:9000",
    PORT: "9050",
    IP: "127.0.0.1",
    PAGE_CD: {}
}

//유틸
global.UTIL = {

    //빈값 체크
    isEmpty: value => {
        if(typeof value === "string"){
            if(value.trim() === "") return true;
            else return false;
        }else{
            if(value === undefined || value === null) return true;
            else return false;
        }
    },

    //값여부 체크
    isNotEmpty: data => !UTIL.isEmpty(data),

    //페이지코드 가져오기
    getPageCode: pageCd => {
        if(pageCd === "MAIN" || UTIL.isEmpty(pageCd)) return "/main/main";
        else return MUI.PAGE_CD[pageCd].pagePath + "/" + MUI.PAGE_CD[pageCd].pageFile;
    },

    //게이트웨이 확인
    isGateway: host => host === MUI.GATEWAY_IP_PORT ? true : false,

    //게이트웨이 확인(request)
    isGatewayReq: request => UTIL.getHost(request) === MUI.GATEWAY_IP_PORT ? true : false,

    //헤더에서 HOST 추출
    getHost: request => {
        if(UTIL.isEmpty(request.headers)){
            return "";
        }else if(UTIL.isEmpty(request.headers.forwarded)){
            return "";
        }else{
            let host = request.headers.forwarded.replace(/"/g, "").split(";");
            if(host.length > 1){
                return host[1].replace("host=", "").replace("localhost", "127.0.0.1");
            }else{
                return "";
            }
        }
    }
}

//초기 세팅
const init = {
    express: null,
    app: null,    
    start: function(express, app){
        this.express = express;
        this.app = app;

        this.fileImport("src");
        this.initGlobalData();
    },

    //정적 리소스 임포트
    fileImport: function(root){        
        fs.readdirSync("./" + root, { withFileTypes: true }).forEach(item => {            
            if(item.isDirectory()){
                this.app.use("/"+item.name, this.express.static(__dirname  + '\\' + root + '\\' +item.name));
            }
        });
    },

    //전역데이터 세팅
    initGlobalData: function(){
        //페이지코드 세팅  
        request.get(MUI.GATEWAY_URI + "/api/admin/getPageCodeList?mduTpCd=ASSETS", (error, response, body) => {
            JSON.parse(body).forEach(page => {
                MUI.PAGE_CD[page.pageCd] = page;
            });
        });
    }
}
module.exports = init;