'use strict';


// var Cookies = require('cookies-js')(window);
// var Material = require('materialize-css@next');

print = (txt, end="") =>{
  console.log( txt + end )
}

class TranslationBox extends React.Component{

  constructor(props){
    super(props);
    this.INPUT = 'input'
    this.OUTPUT = 'output'
    this.state = {
      inputLanguage: {},
      outputLanguage: {},
      inputText: "",
      outputText: "",
      words: []
    };
  }

  fetchTranslation = (text,from,to,model) =>{
    return axios.get('/translate', {
      params:{
        'text':text,
        'from':from,
        'to':to
        }
    }).then( (resp) =>{
      console.log(resp)
      return resp;
    }).catch( (err) =>{
      console.log(err)
    });
  }

  handleTranslation = (id, text)=>{

    let keyFrom = this.key(id, 'Language')
    let keyTo = this.revkey( id,'Language')
    let keyTranslation = this.revkey( id,'Text')

    let from = this.state[keyFrom].code
    let to = this.state[keyTo].code

    this.fetchTranslation(text,from,to).then( (resp)=>{
      const data = resp.data

      this.setState({[keyTranslation]:data.translation})
      console.log(data.translation)
      this.setState({words: data.words})

    })
  }

  handleChange = (id, text) => {
    let key = this.key(id,'Text')
    this.setState({[key]:text})
  }

  handleSelectLanguage = (id, lang)=>{
    let key = this.key(id,'Language')
    this.setState({[key]:lang})
  }

  key = (id,str)=>{
    return id+str
  }

  revkey = (id,str)=>{
    return this.rev(id)+str
  }

  rev = (id) =>{
    return (id==this.INPUT) ? this.OUTPUT : this.INPUT
  }

  render(){
    return(
      <div className="container">
        <FormBox
          id={this.INPUT}
          name={"Input"}
          text={this.state.inputText}
          lang={ { code: 'en', name: 'English' } }
          words={ this.state.words }
          onChange={this.handleChange.bind(this)}
          onTranslate={this.handleTranslation.bind(this)}
          onSelectLanguage = {this.handleSelectLanguage.bind(this)}
          />
        <FormBox
          id={this.OUTPUT}
          name={"Output"}
          text={this.state.outputText}
          lang={ { code: 'zh', name: 'Chinese (Simplified)' } }
          words={ this.state.words }
          onChange={this.handleChange.bind(this)}
          onTranslate={this.handleTranslation.bind(this)}
          onSelectLanguage = {this.handleSelectLanguage.bind(this)}
          />

          <WordBank
            name = {"Words"}
            words = {this.state.words}
          />
      </div>
    )
  }
}


class FormBox extends React.Component{

  constructor(props){
    super(props);
    this.state = {};
  }

  handleFormSubmit = (e=null) =>{
    if( isSet(e) ){
      e.preventDefault()
    }

    // Get text from target state
    let text = this.props.text
    this.props.onTranslate(this.props.id, text)
  }

  handleKeyPress = (e) =>{
    if(e.which == 13 && !e.shiftKey ) {
      e.preventDefault(); // Prevent newline
      this.handleFormSubmit()
    }
   }
   handleChange = (e)=>{
     this.props.onChange(this.props.id, e.target.value)
   }
 
   handleSelectLanguage = (lang) =>{
    this.props.onSelectLanguage(this.props.id, lang)
   }

  render(){
    return (
      <div id={this.props.id + 'Box'} className="box">
        <div className="card">
          <div className="card-tabs">
            <ul className="tabs">
              <li className="tab"><a className="active"><h5>{this.props.name}</h5></a></li>
            </ul>
          </div>
          <div className="form-cont card-content">
            <form onSubmit={this.handleFormSubmit}>
              <LanguageSelect
                lang = {this.props.lang}
                onSelectLanguage={this.handleSelectLanguage.bind(this)}
              />
              <div className="">
                <textarea
                  value={this.props.text}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}>
                </textarea>
              </div>
              {/* <input type="submit"></input> */}
            </form>
          </div>
          <div className="card-tabs">
            <ul className="tabs">
            <li className="tab right"><a className="active" href="" onClick={this.handleFormSubmit}>Submit</a></li>
            </ul>
          </div>
          {/* <WordBank
           words = {this.props.words}
          /> */}
        </div>
      </div>   
    )
  }
}


class WordBank extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }



  render(){
    return (
      <div id="wordsBox" className="box">
        <div className="word-cont card">
          <div className="card-tabs">
              <ul className="tabs">
                <li className="tab"><a className="active"><h5>{this.props.name}</h5></a></li>
              </ul>
          </div>
          <div className="card-content grey lighten-4">
            {this.props.words.map( (word, i)=>{ 
              return <div key={i}> {Object.keys(word)[0]} 	&hArr;   {Object.values(word)[0]} </div>
            })}
          </div>
        </div>
      </div>

    )
  }
}


class LanguageSelect extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      selectedLanguage: isSet(this.props.lang) ? this.props.lang : { code: 'en', name: 'English' },
      languages: [ 
        { code: 'af', name: 'Afrikaans' },
        { code: 'sq', name: 'Albanian' },
        { code: 'am', name: 'Amharic' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hy', name: 'Armenian' },
        { code: 'az', name: 'Azerbaijani' },
        { code: 'eu', name: 'Basque' },
        { code: 'be', name: 'Belarusian' },
        { code: 'bn', name: 'Bengali' },
        { code: 'bs', name: 'Bosnian' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'ca', name: 'Catalan' },
        { code: 'ceb', name: 'Cebuano' },
        { code: 'ny', name: 'Chichewa' },
        { code: 'zh', name: 'Chinese (Simplified)' },
        { code: 'zh-TW', name: 'Chinese (Traditional)' },
        { code: 'co', name: 'Corsican' },
        { code: 'hr', name: 'Croatian' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'nl', name: 'Dutch' },
        { code: 'en', name: 'English' },
        { code: 'eo', name: 'Esperanto' },
        { code: 'et', name: 'Estonian' },
        { code: 'tl', name: 'Filipino' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'fy', name: 'Frisian' },
        { code: 'gl', name: 'Galician' },
        { code: 'ka', name: 'Georgian' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'ht', name: 'Haitian Creole' },
        { code: 'ha', name: 'Hausa' },
        { code: 'haw', name: 'Hawaiian' },
        { code: 'iw', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hmn', name: 'Hmong' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'is', name: 'Icelandic' },
        { code: 'ig', name: 'Igbo' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ga', name: 'Irish' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'jw', name: 'Javanese' },
        { code: 'kn', name: 'Kannada' },
        { code: 'kk', name: 'Kazakh' },
        { code: 'km', name: 'Khmer' },
        { code: 'rw', name: 'Kinyarwanda' },
        { code: 'ko', name: 'Korean' },
        { code: 'ku', name: 'Kurdish (Kurmanji)' },
        { code: 'ky', name: 'Kyrgyz' },
        { code: 'lo', name: 'Lao' },
        { code: 'la', name: 'Latin' },
        { code: 'lv', name: 'Latvian' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'lb', name: 'Luxembourgish' },
        { code: 'mk', name: 'Macedonian' },
        { code: 'mg', name: 'Malagasy' },
        { code: 'ms', name: 'Malay' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'mt', name: 'Maltese' },
        { code: 'mi', name: 'Maori' },
        { code: 'mr', name: 'Marathi' },
        { code: 'mn', name: 'Mongolian' },
        { code: 'my', name: 'Myanmar (Burmese)' },
        { code: 'ne', name: 'Nepali' },
        { code: 'no', name: 'Norwegian' },
        { code: 'or', name: 'Odia (Oriya)' },
        { code: 'ps', name: 'Pashto' },
        { code: 'fa', name: 'Persian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'pa', name: 'Punjabi' },
        { code: 'ro', name: 'Romanian' },
        { code: 'ru', name: 'Russian' },
        { code: 'sm', name: 'Samoan' },
        { code: 'gd', name: 'Scots Gaelic' },
        { code: 'sr', name: 'Serbian' },
        { code: 'st', name: 'Sesotho' },
        { code: 'sn', name: 'Shona' },
        { code: 'sd', name: 'Sindhi' },
        { code: 'si', name: 'Sinhala' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'so', name: 'Somali' },
        { code: 'es', name: 'Spanish' },
        { code: 'su', name: 'Sundanese' },
        { code: 'sw', name: 'Swahili' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tg', name: 'Tajik' },
        { code: 'ta', name: 'Tamil' },
        { code: 'tt', name: 'Tatar' },
        { code: 'te', name: 'Telugu' },
        { code: 'th', name: 'Thai' },
        { code: 'tr', name: 'Turkish' },
        { code: 'tk', name: 'Turkmen' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ur', name: 'Urdu' },
        { code: 'ug', name: 'Uyghur' },
        { code: 'uz', name: 'Uzbek' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'cy', name: 'Welsh' },
        { code: 'xh', name: 'Xhosa' },
        { code: 'yi', name: 'Yiddish' },
        { code: 'yo', name: 'Yoruba' },
        { code: 'zu', name: 'Zulu' }
      ],
      favorites: [
        { code: 'en', name: 'English' },
        { code: 'zh', name: 'Chinese (Simplified)' },
        { code: 'zh-TW', name: 'Chinese (Traditional)' },
        { code: 'ja', name: 'Japanese' },
      ]
    }
    this.props.onSelectLanguage( this.state.selectedLanguage )
  }

  handleChange = (e) =>{
    let lang = {'code':e.target.value, 'name':e.target.options[e.target.selectedIndex].text}
    this.setState({'selectedLanguage':lang}, ()=>{
      this.props.onSelectLanguage(this.state.selectedLanguage)
    })
  }

  createOption = ( lang,i ) =>{

    return <option key={i} value={lang.code}> {lang.name} </option>
  }

  isSelectedLanguage = (lang) =>{
    return lang.code == this.state.selectedLanguage.code
  }

  render(){
    return(
      <div>
        <select className="browser-default" onChange={this.handleChange} name="selectedLanguage" defaultValue={this.props.lang.code}>
        {this.state.favorites.map( (lang, i) =>this.createOption(lang,i) )}
          <option key="spacer" disabled></option>
          {this.state.languages.map( (lang, i) =>this.createOption(lang,i) )}
        </select>
      </div>
    )
  }

}


let inputContainer = document.querySelector('#main-container');
ReactDOM.render(< TranslationBox/>, inputContainer);