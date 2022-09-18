const httpReq = require("./script.js")

async function getHttps(path, type){
    class Status {
        constructor(){
            this.data = "";
            this.request()
                .then(
                this.getData()
                    .then(async r => {
                        var dataJSON = JSON.parse(r)
                        this.data = dataJSON;
                    })
                );
        }
        async request() {
            reqData = httpReq.makeReq(path, type);
            this.data = reqData;
        }
        async getData() {
            return await this.data;
        }
        async parseData() {
            return await this.data;
        }
    }
   
    let inititalize = await new Status;

    await inititalize.getData();

    return await inititalize.parseData();
}

async function getServerStatusNew()
{
    const myObj = new Object();

    var myData = await getHttps("/sapi/v1/system/status", "GET");

    myObj.code = myData.status;
    myObj.message = myData.msg;

    return await myObj;
}

async function getDevicePrice(symbol)
{
    const myObj= new Object();

    var myData = await getHttps(("/api/v3/ticker/price?symbol=" + symbol), "GET");

    myObj.price = myData.price;

    return await myObj;
}

async function getKendelStick(symbol, period)
{
    const myObj= new Object();

    var myData = await getHttps(("/api/v3/klines?symbol=" + symbol + "&interval=" + period + "&limit=1"), "GET");

    myObj.open = myData[0][1];
    myObj.high = myData[0][2];
    myObj.low = myData[0][3];

    return await myObj;
}

module.exports = {
    getDevicePrice,
    getServerStatusNew,
    getKendelStick,
}