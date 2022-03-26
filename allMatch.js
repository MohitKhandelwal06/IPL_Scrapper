const request=require('request');
const cheerio=require('cheerio');
const{gifs}=require('./scorecards');
function getAllMatch(url){
    // console.log(url);
    request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.error(err);
    }else{
        extractAllMatchLink(body);
    }
}

function extractAllMatchLink(html){
    let SelecTool=cheerio.load(html);
    let ScoreCardElemArr=SelecTool('a[data-hover="Scorecard"]');
    // console.log(ScoreCardElemArr.length);
    for(let i=0;i<ScoreCardElemArr.length;i++){
        let ScoreCardLink=SelecTool(ScoreCardElemArr[i]).attr('href');
        let fullLink="https://www.espncricinfo.com"+ScoreCardLink;
        // console.log(i+1+" "+fullLink);
        gifs(fullLink);
    }
}

module.exports={
    getAllMatches:getAllMatch
};