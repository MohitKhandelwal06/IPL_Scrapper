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
    let teamNames=selecTool('.name-detail>.name-link');
    // console.log(teamDetailEle.length);
    // console.log(teamNames.text());
    let team1=selecTool(teamNames[0]).text();
    let team2=selecTool(teamNames[1]).text();
   
    console.log(team1);
    console.log(team2);
    // 4.get result
    let matchResEle=selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    console.log(matchResEle.text());

    // 5. get innings
    let allBatsmenTable=selecTool(".table.batsman tbody");
    let htmlString="";
    let count=0;
    for(let i=0;i<allBatsmenTable.length;i++){
        htmlString+=selecTool(allBatsmenTable[i]).html();
        let allRows=selecTool(allBatsmenTable[i]).find('tr');
        for(let i=0;i<allRows.length;i++){
            let row=selecTool(allRows[i]);
            let firstColumnOfRow=row.find('td')[0];
            
            if((selecTool(firstColumnOfRow).hasClass('batsman-cell'))){
                // will be getting valid data
                // count++;
                // console.log(count);
                let playerName=selecTool(row.find('td')[0]).text();
                let runs=selecTool(row.find('td')[2]).text();
                let balls=selecTool(row.find('td')[3]).text();
                let numberOf4s=selecTool(row.find('td')[5]).text();
                let numberOf6s=selecTool(row.find('td')[6]).text();
                let sr=selecTool(row.find('td')[7]).text();

                console.log(`${playerName} | ${runs} | ${balls}  | ${numberOf4s} | ${numberOf6s} | ${sr}`);
            }
        
        }
        
    }
    // console.log(allBatsmenRows.text());

}

module.exports={
    gifs:getInfoFromScorecard
};