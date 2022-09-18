const api = require("./binance.js")
const fs = require('fs')

var old_value = 0;


const myOrder = new Object();
myOrder.amount = 20;
myOrder.prix = 0;
myOrder.lossCount = 0;
myOrder.lossStop = false

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function getStatus() 
{   
    var obj = await api.getServerStatusNew();
    var stat = obj.message;
    console.log("Le status du serveur est actuellement : [" + stat + "]");   
}

async function getDevicePrice(symbol) 
{
    var obj = await api.getDevicePrice(symbol);
    var stat = obj.price;

    if(myOrder.prix != 0)
    {
        var evolution = (((stat*100)/myOrder.prix) - 100);
        console.log("Voici l'evolution du prix.\n");
    }else{
        var evolution = 0;
        console.log("Vous venez d'initialiser votre ordre.\n");
    }
    

    //console.log(evolution);
    //console.log("Le prix du la devise " + symbol + " est actuellement de [" + stat + "] $  || "+ date_ob);
    //console.log("Le prix en 1/2 : \n - +3 % = " + stat*1.03 + "\n - -1,5 % = " + stat*0.985);

    console.log("Prix actuel : " + stat + " || Prix + 3% : " + stat*1.03 + " || Prix - 1,5% : " + stat*0.985 + " || Evolution par rapport à l'achat à " + myOrder.prix + " : " + (evolution).toFixed(2) + " %\n\n");
    console.log("Différence avec achat à " + myOrder.prix + " : " + (stat - myOrder.prix) + " $ || Vous avez actuellement " + myOrder.amount + "\n\n");

    if(stat > myOrder.limitH && myOrder.prix != 0)
    {
        sell(stat);
        if(myOrder != 0)
        {
            myOrder.lossCount -= 1;
        }
    }else{
        if(stat < myOrder.limitL && myOrder.prix != 0 && myOrder.lossCount < 3)
        {
            sell(stat);
            myOrder.lossCount += 1;
            if(myOrder.lossCount == 3)
            {
                myOrder.lossStop = true;
            }
        }
    }

    return stat; 
}

async function getKendelStick(symbol, intervale) 
{
    let date_ob = new Date();

    var obj = await api.getKendelStick(symbol, intervale);
    var stat = obj;
    old_value = stat.open;
    console.log("Voici les différentes info relatives à la devise [" + symbol + "] : \n - Prix d'entrée : [" + stat.open + "] \n - Prix Haut ; [" + stat.high + "] \n - Prix Bas : [" + stat.low + "]\n\n")
    return stat; 
}

async function sell(priceNow) {
    console.log("Vous venez de vendre à " + priceNow + "\n\n")
    var evolution = -(((myOrder.prix*100)/priceNow) - 100);
    console.log("Voici votre évolution = " + (1+(evolution)/100) + " \n\n");
    var mymoney = myOrder.amount * (1 + (evolution/100));
    myOrder.amount = mymoney;
    console.log("Vous avez " + myOrder.amount + "\n\n")
    myOrder.prix = 0;
    return 0
}

async function buy() {
    return 0
}

async function createOrder(prix) 
{
    myOrder.prix = prix;
    myOrder.limitH = (prix * 1.003);
    myOrder.limitL = (prix * (1-0.0015));
    console.log("Vous venez de placer un ordre avec " + myOrder.amount + "€ à " + myOrder.prix + " \n Voici les charactéristiques : \n - Limite Haut = " + myOrder.limitH + " \n - Limite Bas = " + myOrder.limitL);
    console.log(myOrder.prix + "\n\n");
    return 0
}

async function main() 
{


    await getStatus();

    if(myOrder.prix == 0)
    {
        price = await getDevicePrice("QSPETH"); //Get current price data
        await createOrder(price);
    }

    console.log(myOrder.prix);

    while(1)
    {
        var time = 60; //Définition d'un cycle de 1 minute

        console.log("\n\n[---------------------------------------DATA sur 1 Min---------------------------------------]\n\n");
        kendel = await getKendelStick("QSPETH", "1m"); //Get kandke stick data

        await sleep(1000);

        while(time > 0)
        {
            price = await getDevicePrice("QSPETH"); //Get current price data

            if(myOrder.prix == 0 && myOrder.lossCount != 3)
            {
                createOrder(price);
            }else{
                console.log("\n\n[------------------------------------STOP LOSS ACTIVE--------------------------------------]\n\n");
            }

            await sleep(1000);
            time -= 2;
        }
        


        console.log("\n\n[------------------------------------END DATA sur 1 Min--------------------------------------]\n\n");
    }
}

main();
