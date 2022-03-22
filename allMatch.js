const request=require('request');
const cheerio=require('cheerio');

function getAllMatch(url){
    console.log(url);
    request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.error(err);
    }else{
        extractAllMatchLink(body);
    }
}

function extractMatchLink(html){
    let SelecTool=cheerio.load(html);
    
}

module.exports={
    getAllMatches:getAllMatch
};