//this is a change to see if it works
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const fs = require('fs');

app.use(express.static(path.join(__dirname,"static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//turn our text file into json
//we use %% to split up our objects it is an arbitrary delimeter
function parseFile(filename){
   console.log('opening file')
    let allExamples = null;
    try{
        allExamples = fs.readFileSync(path.basename(filename), 'utf8');
        console.log('opened file');
    }catch(e){
        console.log(e)
        allExamples = 'error';
    }
    let allExamplesArray = allExamples.split('%%');
    //the shift is needed because the first thing will always be empty
    allExamplesArray.shift();
    //turn this into JSON objects
    console.log('split file it contains ' + allExamplesArray.length + ' examples');
    if(allExamplesArray != null && allExamplesArray.length > 0 && allExamplesArray[0] != null){
        allExamplesArray = allExamplesArray.map(x => JSON.parse(x));

        return(allExamplesArray);
    }else{
        console.log('returned empty array');
        return [];
    }
}

//get routes are reteiving data (from our text file)
//most to least specific
app.get("/examples/:id", async (req, res) => {
    //filter can be a bit daunting, it is just returning all of the objects with the id specified in the route
    if(parseFile('allData.txt').length > 0 && (parseFile('allData.txt').filter(x => x.id == req.params.id)[0])){
        res.json(parseFile('allData.txt').filter(x => x.id == req.params.id)[0]);
    }else{
        res.json({'error':'example not found'});
    }
});

app.get("/examples", async (req, res) => {
    if(parseFile('allData.txt').length > 0){
        res.json(parseFile('allData.txt'));
    }else{
        res.json({"error":'no examples found'});
    }
});

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname,"static","index.html"));
});

//post routes put data into our database (the text file)
app.post("/examples",async (req, res) => {
    let exampleData = JSON.stringify(req.body);
    exampleData = '%%' + exampleData;
    try{
        fs.appendFileSync('allData.txt',exampleData);
        res.json({exampleData});
    }catch(e){
        console.log(e);
        res.json({"error":"couldn't write to file","errorText":e});
    }
});
//delete request deletes a object form our file
app.delete("/examples/:id",async(req,res) => {
    //filter out all the ids that are not the one we want this is okay cause it's easy but now we can't return the value we deleted
    allData = (parseFile('allData.txt').filter(x => x.id != req.params.id)[0]);
    //delete old data
    fs.unlinkSync('allData.txt');
    //turn the array back into a string
    allData = allData.reduce((y,x) => y+'%%'+JSON.stringify(x));
    fs.writeSync('allData.txt',allData);
    return({"success":true});

});

//i didn't include a PUT request you probably won't need it Put requests are generally made to update something
const server = app.listen(port, () => {
    console.log("connected to api sever listening on http://localhost:"+port);

});

