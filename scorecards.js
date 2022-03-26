const request = require('request');
const cheerio=require('cheerio');
const path=require('path');
const fs=require("fs");
const xlsx=require("xlsx");

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
    // console.log(dateOfMatch);
    // console.log(venueOfMatch);
    // 3.get team names
    let teamNames=selecTool('.name-detail>.name-link');
    // console.log(teamDetailEle.length);
    // console.log(teamNames.text());
    let team1=selecTool(teamNames[0]).text();
    let team2=selecTool(teamNames[1]).text();
   
    // console.log(team1);
    // console.log(team2);
    // 4.get result
    let matchResEle=selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    // console.log(matchResEle.text());
    let matchResult=matchResEle.text();

    // 5. get innings
    let allBatsmenTable=selecTool(".table.batsman tbody");
    let htmlString="";
    let count=0;
    for(let i=0;i<allBatsmenTable.length;i++){
        htmlString+=selecTool(allBatsmenTable[i]).html();
        let allRows=selecTool(allBatsmenTable[i]).find('tr');
        let teamA=selecTool(teamNames[i]).text();
        let teamB=selecTool(teamNames[1-i]).text();
        for(let i=0;i<allRows.length;i++){
            let row=selecTool(allRows[i]);
            let firstColumnOfRow=row.find('td')[0];
            
            if((selecTool(firstColumnOfRow).hasClass('batsman-cell'))){
                // will be getting valid data
                // count++;
                // console.log(count);
                
                let playerName=selecTool(row.find('td')[0]).text().trim();
                let runs=selecTool(row.find('td')[2]).text();
                let balls=selecTool(row.find('td')[3]).text();
                let numberOf4s=selecTool(row.find('td')[5]).text();
                let numberOf6s=selecTool(row.find('td')[6]).text();
                let sr=selecTool(row.find('td')[7]).text();

                console.log(`${playerName} | ${runs} | ${balls}  | ${numberOf4s} | ${numberOf6s} | ${sr} | ${teamA} |vs| ${teamB}`);

                processInformation(dateOfMatch,venueOfMatch,matchResult,teamA,teamB,playerName,runs,balls,numberOf4s,numberOf6s,sr);
            }
        
        }
        
    }
    // console.log(allBatsmenRows.text());

}
function processInformation(dateOfMatch,venueOfMatch,matchResult,ownTeam,opponentTeam,playerName,runs,balls,numberOf4,numberOf6,sr){
    let teamNamePath=path.join(__dirname,"IPL",ownTeam);
    if(!fs.existsSync(teamNamePath)){
        fs.mkdirSync(teamNamePath);
    }

    let playerPath=path.join(teamNamePath,playerName+'.xlsx');
    let content=excelReader(playerPath,playerName);
    let playerObj={
        dateOfMatch,
        venueOfMatch,
        matchResult,
        ownTeam,
        opponentTeam,
        playerName,
        runs,
        balls,
        numberOf4,
        numberOf6,
        sr
    };
    content.push(playerObj);
    // This function writes all the content into excel sheet, and puts that excel sheet into playerPath
    excelWriter(playerPath,content,playerName);
}

// this function reads the data from excel file.
function excelReader(playerPath,sheetName){
    if(!fs.existsSync(playerPath)){
        return [];
    }
    const workBook=xlsx.readFile(playerPath);
    let excelData=workBook.Sheets[sheetName];
    let playerObj=xlsx.utils.sheet_to_json(excelData);
    return playerObj;
}


function excelWriter(playerPath,jsObject,sheetName){
    // Creates a new workbook
    let newWorkBook=xlsx.utils.book_new();
    // creates an array of js objects to worksheet
    let newWorkSheet=xlsx.utils.json_to_sheet(jsObject);
    // it appends a worksheet to a workbook
    xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetName);

    // attempts to write or download workbook data to a file
    xlsx.writeFile(newWorkBook,playerPath);
}
module.exports={
    gifs:getInfoFromScorecard
};