var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();
const views = app.get('views')

const projectID = "translato-1588143946411"
const credentialPath = path.join(global.appRoot, 'translato-e4842481baaa.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.sendFile( path.join( views, 'index.html' ) )

});


router.get('/translate', function(req, res, next){

  const from = req.query.from
  const to = req.query.to
  const model = 'nmt'
  
  let text = req.query.text

  getTranslation(text, from, to, model).catch(err=>{
    console.log(err);
  }).then( resp=>{
    res.send(resp)
  });

});

const getLangSplitChar= (code)=>{
  const langs = ['zh', 'zh-TW', 'ja', 'co']
  let isScriptLang = langs.includes( code )

  if( isScriptLang ){
    return ""
  }else{
    return " "
  }
}


async function getTranslation(text, from, to, model) {
  
  console.log(text)

  // Create Translation instance
  const {Translate} = require('@google-cloud/translate').v2;
  const translate = new Translate({
    projectId: "translato-1588143946411",
    keyFilename: path.join(global.appRoot, 'translato-e4842481baaa.json')
  });

  // Set Options
  const options = {
    to: to,
    model: model
  };


  // For each translation, split into individual words.
  let splitChar = getLangSplitChar(from);
  let textArray = text.split( splitChar );
  
  let data = {};
  data.from = from
  data.to = to

  // Translate whole translation.
  let [translation] = await translate.translate([text], options);
  // Translate individual words.
  let [transationArray] = await translate.translate(textArray, options);
  
  data.text = text;
  data.translation = translation[0]; //remove from array wrapped array

  data.words = []
  textArray.forEach((text, i) => {
    data.words[i] = {};
    data.words[i][text] = transationArray[i]
  });

  return data;
}



async function listLanguages() {
  const {Translate} = require('@google-cloud/translate').v2;
  const translate = new Translate();

  // Lists available translation language with their names in English (the default).
  const [languages] = await translate.getLanguages();
  console.log('Languages:');
  languages.forEach(language => console.log(language ));
}





module.exports = router;
