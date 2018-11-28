// Variaveis globais

var tabuleiro, vetorPalavra, palavras, palavrasAtivas, auxCriar;

var limites = {  
  superior:0, direita:0, inferior:0, esquerda:0,

  Atualiza:function(x,y){
    this.superior = Math.min(y,this.superior);
    this.direita = Math.max(x,this.direita);
    this.inferior = Math.max(y,this.inferior);
    this.esquerda = Math.min(x,this.esquerda);
  },
  
  Limpa:function(){
    this.superior = 999;
    this.direita = 0;
    this.inferior = 0;    
    this.esquerda = 999;    
  }
};


// Main

function jogar(){
  var vetorLetra = document.getElementsByClassName('letra');
  
  for(var i = 0; i < vetorLetra.length; i++){
    vetorLetra[i].innerHTML = "<input class='char' type='text' maxlength='1'></input>";
  }
  
  auxCriar = 0;
  alternarCaixasEntrada(false);
}


function Criar(){
  if (auxCriar === 0){
    alternarCaixasEntrada(true);
    document.getElementById("cacaPalavra").innerHTML = tabuProHtml(" ")
    auxCriar = 1;
  }
  else{  
    getPalavrasInseridas();

    for(var i = 0, deuCerto=false; i < 10 && !deuCerto; i++){
      limparVariaveis(); // Seta os valores esq,dir,cima,baixo
      deuCerto = preencherTabu(); //Adiciona palavras ao tabuleiro
    }

    document.getElementById("cacaPalavra").innerHTML = 
      (deuCerto) ? tabuProHtml(" ") : "Caça palavras não encontrado." ; //Se deu certo for falso, significa que não existe o caça palavras. Se for verdadeiro ele printa o tabuleiro
  }
}


function alternarCaixasEntrada(ativo){
  var p=document.getElementsByClassName('palavra'),
      d=document.getElementsByClassName('dica');
  
  for(var i=0;i<p.length; i++){
    if(ativo===true){
      retiraClasse(p[i], 'hide');
      retiraClasse(d[i], 'somenteLeitura');
      d[i].disabled = ''; // Deixa o d desabilitado
    }
    else{
      adicionaClasse(p[i], 'hide');
      adicionaClasse(d[i], 'somenteLeitura');
      d[i].disabled = 'somenteLer'; // Deixa o d desabilitado
    }
  }
}


function getPalavrasInseridas(){
  vetorPalavra = [];  
  for(var i=0,val,p=document.getElementsByClassName("palavra");i<p.length;i++){
    val = p[i].value.toUpperCase(); // Muda o valor do textfield da palavra para Maiusculo e armazena em val
    if (val !== null && val.length > 1){vetorPalavra.push(val);} // Se val der certo, ele da um push(empurra) na função vetor
  }
}


function limparVariaveis(){
  limites.Limpa();
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
    palavras.push(new objPalavra(vetorPalavra[i]));
  }
  
  for(i = 0; i < palavras.length; i++){
    for(var j = 0, palavraA=palavras[i]; j<palavraA.char.length; j++){
      for(var k = 0, cA=palavraA.char[j]; k<palavras.length; k++){
        for(var l = 0,palavraB=palavras[k]; k!==i && l<palavraB.char.length; l++){
          palavraA.todosEncontros += (cA === palavraB.char[l])?1:0;
        }
      }
    }
  }  
}


//Inicializaçao da função que adiciona palavra no tabuleiro e faz algumas verificações
function addPalavraTabuleiro(){
  var i, len, indiceAtual, palavraAtual, charAtual, curMatch, palavraTeste, charTeste, 
      minCombinaDiff = 9999, CombinacaoAtualDiff;  

  if(palavrasAtivas.length < 1){
    indiceAtual = 0;
    for(i = 0, len = palavras.length; i < len; i++){
      if (palavras[i].todosEncontros < palavras[indiceAtual].todosEncontros){
        indiceAtual = i;
      }
    }
    palavras[indiceAtual].combinacoesCertas = [{x:12,y:12,dir:0}];
  }
  else{  
    indiceAtual = -1;
    
    for(i = 0, len = palavras.length; i < len; i++){
      palavraAtual = palavras[i];
      palavraAtual.combinacoesEfetivas = 0;
      palavraAtual.combinacoesCertas = [];
      for(var j = 0, lenJ = palavraAtual.char.length; j < lenJ; j++){
        charAtual = palavraAtual.char[j];
        for (var k = 0, lenK = palavrasAtivas.length; k < lenK; k++){
          palavraTeste = palavrasAtivas[k];
          for (var l = 0, lenL = palavraTeste.char.length; l < lenL; l++){
            charTeste = palavraTeste.char[l];            
            if (charAtual === charTeste){
              palavraAtual.combinacoesEfetivas++;
              
              var cruzadaAtual = {x:palavraTeste.x,y:palavraTeste.y,dir:0};              
              if(palavraTeste.dir === 0){                
                cruzadaAtual.dir = 1;
                cruzadaAtual.x += l;
                cruzadaAtual.y -= j;
              } 
              else{
                cruzadaAtual.dir = 0;
                cruzadaAtual.y += l;
                cruzadaAtual.x -= j;
              }
              //variavel booleana para definir se os char sao iguais ou nao
              var saoIguais = true;
              
              for(var m = -1, lenM = palavraAtual.char.length + 1; m < lenM; m++){
                var crossVal = [];
                if (m !== j){
                  if (cruzadaAtual.dir === 0){
                    var indiceX = cruzadaAtual.x + m;
                    
                    if (indiceX < 0 || indiceX > tabuleiro.length){
                      saoIguais = false;
                      break;
                    }
                    
                    crossVal.push(tabuleiro[indiceX][cruzadaAtual.y]);
                    crossVal.push(tabuleiro[indiceX][cruzadaAtual.y + 1]);
                    crossVal.push(tabuleiro[indiceX][cruzadaAtual.y - 1]);
                  }
                  else{
                    var indiceY = cruzadaAtual.y + m;
                    
                    if (indiceY < 0 || indiceY > tabuleiro[cruzadaAtual.x].length){
                      saoIguais = false;
                      break;
                    }
                    
                    crossVal.push(tabuleiro[cruzadaAtual.x][indiceY]);
                    crossVal.push(tabuleiro[cruzadaAtual.x + 1][indiceY]);
                    crossVal.push(tabuleiro[cruzadaAtual.x - 1][indiceY]);
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
                palavraAtual.combinacoesCertas.push(cruzadaAtual); // Se forem iguais ira dar um push
              }
            }
          }
        }
      }
      
      CombinacaoAtualDiff = palavraAtual.todosEncontros - palavraAtual.combinacoesEfetivas;
      
      if (CombinacaoAtualDiff<minCombinaDiff && palavraAtual.combinacoesCertas.length>0){
        CombinacaoAtualDiff = minCombinaDiff;
        indiceAtual = i;
      }
      else if (CombinacaoAtualDiff <= 0){
        return false;
      }
    }
  }
  
  if (indiceAtual === -1){
    return false;
  }
  // A função splice ajuda a alocar em uma posição especifica  
  var divide = palavras.splice(indiceAtual, 1);
  palavrasAtivas.push(divide[0]);

  
  var pushIndice = palavrasAtivas.length - 1,
      rand = Math.random(),
      vetorCombinacao = palavrasAtivas[pushIndice].combinacoesCertas,
      indiceCombinacao = Math.floor(rand * vetorCombinacao.length),  
      dadosCombinacao = vetorCombinacao[indiceCombinacao];
  
  palavrasAtivas[pushIndice].x = dadosCombinacao.x;
  palavrasAtivas[pushIndice].y = dadosCombinacao.y;
  palavrasAtivas[pushIndice].dir = dadosCombinacao.dir;
  
  for(i = 0, len = palavrasAtivas[pushIndice].char.length; i < len; i++){
    var indiceX = dadosCombinacao.x,
        indiceY = dadosCombinacao.y;
    
    if (dadosCombinacao.dir === 0){
      indiceX += i;    
      tabuleiro[indiceX][indiceY] = palavrasAtivas[pushIndice].char[i];
    }
    else{
      indiceY += i;  
      tabuleiro[indiceX][indiceY] = palavrasAtivas[pushIndice].char[i];
    }
    
    limites.Atualiza(indiceX,indiceY);
  }
    
  return true;
}


function tabuProHtml(blank){
  for(var i=limites.superior-1, str=""; i<limites.inferior+2; i++){
    str+="<div class='row'>";
    for(var j=limites.esquerda-1; j<limites.direita+2; j++){
      str += transformaChar(tabuleiro[j][i]);
    }
    str += "</div>";
  }
  return str;
}


function transformaChar(c){
  var arr=(c)?['quadrado','letra']:['quadrado'];
  return EleStr('div',[{a:'class',v:arr}],c);
}



// Definindo os objetos

function objPalavra(stringValue){
  this.string = stringValue;
  this.char = stringValue.split("");
  this.todosEncontros = 0;
  this.combinacoesEfetivas = 0;
  this.combinacoesCertas = [];  
}


// Eventos

function RegisterEvents(){
  document.getElementById("cacaPalavra").onfocus = function (){ 
    return false; }
  document.getElementById("btnCriar").addEventListener('click',Criar,false);
  document.getElementById("btnjogar").addEventListener('click',jogar,false);
}
RegisterEvents();


// Funções de ajuda

function EleStr(e,c,h){ //Element string
  h = (h)?h:"";
  for(var i=0,s="<"+e+" "; i<c.length; i++){
    s+=c[i].a+ "='"+vetorToString(c[i].v," ")+"' ";    
  }
  return (s+">"+h+"</"+e+">");
}

function vetorToString(vetor,string){
  if(vetor===null||vetor.length<1)return "";
  if(string===null)string=",";
  for(var r=vetor[0],i=1;i<vetor.length;i++){r+=string+vetor[i];}
  return r;
}

// Ele da um replace no nome da classe, mudando para hide(escondido) ou somenteLer o char que for escrito
function adicionaClasse(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'')+' '+classStr; 
}

//Mesma coisa que a função de cima, só que no caso ele ao invés de adicionar só muda
function retiraClasse(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'');
}

//Mesmos parametros, só que no caso ele alterna a classe, no caso da string ser igual ao tamanho da classe do elemento
function alternaClasse(ele,classStr){
  var str = ele.className.replaceAll(' '+classStr,'');
  ele.className = (str.length===ele.className.length)?str+' '+classStr:str;
}

// Usado para encontrar uma combinação entre uma expressão regular e uma string, e para substituir uma substring combinada com uma nova substring.
String.prototype.replaceAll = function (substituiIsso, comIsso) {
   var re = new RegExp(substituiIsso,"g"); // Expressão regular para substituição.
   return this.replace(re, comIsso);
};


// Chamada de funções

Criar();
jogar();
