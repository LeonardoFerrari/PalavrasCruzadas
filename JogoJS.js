// Variaveis globais

var tabuleiro, vetorPalavra, palavras, palavrasAtivas, auxCriar;

var Bounds = {  
  top:0, right:0, bottom:0, left:0,

  Update:function(x,y){
    this.top = Math.min(y,this.top);
    this.right = Math.max(x,this.right);
    this.bottom = Math.max(y,this.bottom);
    this.left = Math.min(x,this.left);
  },
  
  Clean:function(){
    this.top = 999;
    this.right = 0;
    this.bottom = 0;    
    this.left = 999;
  }
};


// Main

function jogar(){
  var letterArr = document.getElementsByClassName('letter');
  
  for(var i = 0; i < letterArr.length; i++){
    letterArr[i].innerHTML = "<input class='char' type='text' maxlength='1'></input>";
  }
  
  auxCriar = 0;
  ToggleInputBoxes(false);
}


function Criar(){
  if (auxCriar === 0){
    ToggleInputBoxes(true);
    document.getElementById("crossword").innerHTML = tabuProHtml(" ")
    auxCriar = 1;
  }
  else{  
    GetWordsFromInput();

    for(var i = 0, isSuccess=false; i < 10 && !isSuccess; i++){
      CleanVars();
      isSuccess = preencherTabu();
    }

    document.getElementById("crossword").innerHTML = 
      (isSuccess) ? tabuProHtml(" ") : "Failed to find crossword." ;
  }
}


function ToggleInputBoxes(active){
  var w=document.getElementsByClassName('word'),
      d=document.getElementsByClassName('clue');
  
  for(var i=0;i<w.length; i++){
    if(active===true){
      RemoveClass(w[i], 'hide');
      RemoveClass(d[i], 'clueReadOnly');
      d[i].disabled = '';
    }
    else{
      AddClass(w[i], 'hide');
      AddClass(d[i], 'clueReadOnly');
      d[i].disabled = 'readonly';
    }
  }
}


function GetWordsFromInput(){
  vetorPalavra = [];  
  for(var i=0,val,w=document.getElementsByClassName("word");i<w.length;i++){
    val = w[i].value.toUpperCase();
    if (val !== null && val.length > 1){vetorPalavra.push(val);}
  }
}


function CleanVars(){
  Bounds.Clean();
  palavras = [];
  palavrasAtivas = [];
  tabuleiro = [];
  
  for(var i = 0; i < 32; i++){
    tabuleiro.push([]);
    for(var j = 0; j < 32; j++){
      tabuleiro[i].push(null);
    }
  }
}


function preencherTabu(){
  prepararTabu();
  
  for(var i=0,verificaTabu=true,len=palavras.length; i<len && verificaTabu; i++){
    verificaTabu = addPalavraTabuleiro();
  }  
  return verificaTabu;
}


function prepararTabu(){
  palavras=[];
  
  for(var i = 0, len = vetorPalavra.length; i < len; i++){
    palavras.push(new WordObj(vetorPalavra[i]));
  }
  
  for(i = 0; i < palavras.length; i++){
    for(var j = 0, wA=palavras[i]; j<wA.char.length; j++){
      for(var k = 0, cA=wA.char[j]; k<palavras.length; k++){
        for(var l = 0,wB=palavras[k]; k!==i && l<wB.char.length; l++){
          wA.totalMatches += (cA === wB.char[l])?1:0;
        }
      }
    }
  }  
}



function addPalavraTabuleiro(){
  var i, len, curIndex, palavraAtual, curChar, curMatch, testWord, testChar, 
      minMatchDiff = 9999, curMatchDiff;  

  if(palavrasAtivas.length < 1){
    curIndex = 0;
    for(i = 0, len = palavras.length; i < len; i++){
      if (palavras[i].totalMatches < palavras[curIndex].totalMatches){
        curIndex = i;
      }
    }
    palavras[curIndex].successfulMatches = [{x:12,y:12,dir:0}];
  }
  else{  
    curIndex = -1;
    
    for(i = 0, len = palavras.length; i < len; i++){
      palavraAtual = palavras[i];
      palavraAtual.effectiveMatches = 0;
      palavraAtual.successfulMatches = [];
      for(var j = 0, lenJ = palavraAtual.char.length; j < lenJ; j++){
        curChar = palavraAtual.char[j];
        for (var k = 0, lenK = palavrasAtivas.length; k < lenK; k++){
          testWord = palavrasAtivas[k];
          for (var l = 0, lenL = testWord.char.length; l < lenL; l++){
            testChar = testWord.char[l];            
            if (curChar === testChar){
              palavraAtual.effectiveMatches++;
              
              var cruzadaAtual = {x:testWord.x,y:testWord.y,dir:0};              
              if(testWord.dir === 0){                
                cruzadaAtual.dir = 1;
                cruzadaAtual.x += l;
                cruzadaAtual.y -= j;
              } 
              else{
                cruzadaAtual.dir = 0;
                cruzadaAtual.y += l;
                cruzadaAtual.x -= j;
              }
              
              var saoIguais = true;
              
              for(var m = -1, lenM = palavraAtual.char.length + 1; m < lenM; m++){
                var crossVal = [];
                if (m !== j){
                  if (cruzadaAtual.dir === 0){
                    var xIndex = cruzadaAtual.x + m;
                    
                    if (xIndex < 0 || xIndex > tabuleiro.length){
                      saoIguais = false;
                      break;
                    }
                    
                    crossVal.push(tabuleiro[xIndex][cruzadaAtual.y]);
                    crossVal.push(tabuleiro[xIndex][cruzadaAtual.y + 1]);
                    crossVal.push(tabuleiro[xIndex][cruzadaAtual.y - 1]);
                  }
                  else{
                    var yIndex = cruzadaAtual.y + m;
                    
                    if (yIndex < 0 || yIndex > tabuleiro[cruzadaAtual.x].length){
                      saoIguais = false;
                      break;
                    }
                    
                    crossVal.push(tabuleiro[cruzadaAtual.x][yIndex]);
                    crossVal.push(tabuleiro[cruzadaAtual.x + 1][yIndex]);
                    crossVal.push(tabuleiro[cruzadaAtual.x - 1][yIndex]);
                  }

                  if(m > -1 && m < lenM-1){
                    if (crossVal[0] !== palavraAtual.char[m]){
                      if (crossVal[0] !== null){
                        saoIguais = false;                  
                        break;
                      }
                      else if (crossVal[1] !== null){
                        saoIguais = false;
                        break;
                      }
                      else if (crossVal[2] !== null){
                        saoIguais = false;                  
                        break;
                      }
                    }
                  }
                  else if (crossVal[0] !== null){
                    saoIguais = false;                  
                    break;
                  }
                }
              }
              
              if (saoIguais === true){                
                palavraAtual.successfulMatches.push(cruzadaAtual);
              }
            }
          }
        }
      }
      
      curMatchDiff = palavraAtual.totalMatches - palavraAtual.effectiveMatches;
      
      if (curMatchDiff<minMatchDiff && palavraAtual.successfulMatches.length>0){
        curMatchDiff = minMatchDiff;
        curIndex = i;
      }
      else if (curMatchDiff <= 0){
        return false;
      }
    }
  }
  
  if (curIndex === -1){
    return false;
  }
    
  var spliced = palavras.splice(curIndex, 1);
  palavrasAtivas.push(spliced[0]);
  
  var pushIndex = palavrasAtivas.length - 1,
      rand = Math.random(),
      matchArr = palavrasAtivas[pushIndex].successfulMatches,
      matchIndex = Math.floor(rand * matchArr.length),  
      matchData = matchArr[matchIndex];
  
  palavrasAtivas[pushIndex].x = matchData.x;
  palavrasAtivas[pushIndex].y = matchData.y;
  palavrasAtivas[pushIndex].dir = matchData.dir;
  
  for(i = 0, len = palavrasAtivas[pushIndex].char.length; i < len; i++){
    var xIndex = matchData.x,
        yIndex = matchData.y;
    
    if (matchData.dir === 0){
      xIndex += i;    
      tabuleiro[xIndex][yIndex] = palavrasAtivas[pushIndex].char[i];
    }
    else{
      yIndex += i;  
      tabuleiro[xIndex][yIndex] = palavrasAtivas[pushIndex].char[i];
    }
    
    Bounds.Update(xIndex,yIndex);
  }
    
  return true;
}


function tabuProHtml(blank){
  for(var i=Bounds.top-1, str=""; i<Bounds.bottom+2; i++){
    str+="<div class='row'>";
    for(var j=Bounds.left-1; j<Bounds.right+2; j++){
      str += transformaChar(tabuleiro[j][i]);
    }
    str += "</div>";
  }
  return str;
}


function transformaChar(c){
  var arr=(c)?['square','letter']:['square'];
  return EleStr('div',[{a:'class',v:arr}],c);
}



// Definindo os objetos

function WordObj(stringValue){
  this.string = stringValue;
  this.char = stringValue.split("");
  this.totalMatches = 0;
  this.effectiveMatches = 0;
  this.successfulMatches = [];  
}


// Eventos

function RegisterEvents(){
  document.getElementById("crossword").onfocus = function (){ 
    return false; }
  document.getElementById("btnCriar").addEventListener('click',Criar,false);
  document.getElementById("btnjogar").addEventListener('click',jogar,false);
}
RegisterEvents();


// Funções de ajuda

function EleStr(e,c,h){
  h = (h)?h:"";
  for(var i=0,s="<"+e+" "; i<c.length; i++){
    s+=c[i].a+ "='"+ArrayToString(c[i].v," ")+"' ";    
  }
  return (s+">"+h+"</"+e+">");
}

function ArrayToString(a,s){
  if(a===null||a.length<1)return "";
  if(s===null)s=",";
  for(var r=a[0],i=1;i<a.length;i++){r+=s+a[i];}
  return r;
}

function AddClass(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'')+' '+classStr;
}

function RemoveClass(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'');
}

function ToggleClass(ele,classStr){
  var str = ele.className.replaceAll(' '+classStr,'');
  ele.className = (str.length===ele.className.length)?str+' '+classStr:str;
}

String.prototype.replaceAll = function (replaceThis, withThis) {
   var re = new RegExp(replaceThis,"g"); 
   return this.replace(re, withThis);
};


// Chamada de funções

Criar();
jogar();
