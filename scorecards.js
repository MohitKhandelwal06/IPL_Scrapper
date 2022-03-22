const request = require('request');
const cheerio=require('cheerio');

function getInfoFromScorecard(url){
// console.log("from scorecard.js  "+ url);
request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.error(err);
    }else{
        getMatchDetails(body);
    }
}
function getMatchDetails(html){
    // selectool contains html of ith scorecard.
    let selecTool=cheerio.load(html);
    let desc=selecTool(".match-header-info.match-info-MATCH");
    // console.log(desc.text());
    // 1.get Venue
    // 2.get Date 
    let descArr=desc.text().split(",");
    // console.log(descArr);
    let dateOfMatch=descArr[2];
    let venueOfMatch=descArr[1];
    console.log(dateOfMatch);
    console.log(venueOfMatch);
    // 3.get team names
    let teamDetailEle=selecTool('a[class="name-link"]>.name');
    // console.log(teamDetailEle.length);
    // console.log(teamDetailEle.text());
    // let team1=teamDetailEle.text()[0];
    // let team2=teamDetailEle.text()[1];
    for(let i=0;i<teamDetailEle.length;i++){
        console.log(teamDetailEle[i].text());
    }
    console.log(team1);
    console.log(team2);
    // 4.get result
    let matchResEle=selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    console.log(matchResEle.text());

}

module.exports={
    gifs:getInfoFromScorecard
};