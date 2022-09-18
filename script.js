const https = require('https')
const fs = require('fs')

var temp;
var dat;

async function makeReq(path, type)
{
    return await makeReq_temp(path, type);
}

async function makeReq_temp(path, type)
{

    temp = "";
    reqData = "";

    const options = {
        hostname: 'api.binance.com',
        port: 443,
        path: path,
        method: type
    }
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, async res => {
            //console.log(`statusCode: ${res.statusCode}`)

            
            res.on('data', d => {
                dat = d.toString();
                temp = d;
                //console.log(temp);
            })

            res.on('end', () => {
                resolve(dat);
            });
        })

        req.on('error', (err) => {
            reject(err);
        });
        
        //await console.log(temp)

        req.write(temp)
        req.end();

        //return await temp;
    })
}

module.exports = {
    makeReq
}