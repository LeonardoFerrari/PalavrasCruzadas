//Globais
var textoAtual;
var dadoVetor;
//Chama de funçao para incializar o caça
function telaDoJogo(){
	var tabelaPuzzle = document.getElementById("puzzle");
	dadoVetor = vetorDoPuzzle();
	for ( var i = 0; i < dadoVetor.length ; i++ ) {
		var linha = tabelaPuzzle.insertRow(-1);
		var dadoLinha = dadoVetor[i];
		for(var j = 0 ; j < dadoLinha.length ; j++){
			var celula = linha.insertCell(-1);
			if(dadoLinha[j] != 0){
				var txtID = String('txt' + '' + i + '' + j);
				celula.innerHTML = '<input type="text" class="caixaDeEntrada" maxlength="1" style="text-transform: lowercase" ' + 'id="' + txtID + '" onfocus="guardaID(' + "'" + txtID + "'"+ ')">';
			}else{
				celula.style.backgroundColor  = "black";
			}
		}
	}
	addDica();
}
// Dicas
function addDica(){
	document.getElementById("txt_0_4").placeholder = "1";
	document.getElementById("txt_2_6").placeholder = "2";
	document.getElementById("txt_3_1").placeholder = "3";
	document.getElementById("txt_3_9").placeholder = "4";
	document.getElementById("txt_6_2").placeholder = "5";
	document.getElementById("txt_9_0").placeholder = "6";
}
//guarda o ID da célula selecionada dentro do textoAtual
function guardaID(txtID123){
	textoAtual = txtID123;
}
// Retorna o vetor
function vetorDoPuzzle(){
var itens = [	[0, 0, 0, 0, 'a', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'r', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'r', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'r', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'o', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'z', 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			]; //Coloca as letras da palavra que você quer formar dentro do vetor
return itens;
}
// Limpa os campos
function limpaPuzzle(){
	textoAtual = '';
	var tabelaPuzzle = document.getElementById("puzzle");
	tabelaPuzzle.innerHTML = '';
    telaDoJogo();
}
// Botao de checagem
function checaPuzzle(){
	for ( var i = 0; i < dadoVetor.length ; i++ ) {
		var dadoLinha = dadoVetor[i];
		for(var j = 0 ; j < dadoLinha.length ; j++){
			if(dadoLinha[j] != 0){
				var selectedInputTextElement = document.getElementById('txt' + '' + i + '' + j);
				if(selectedInputTextElement.value != dadoVetor[i][j]){
					selectedInputTextElement.style.backgroundColor = 'red';
					
				}else{
					selectedInputTextElement.style.backgroundColor = 'white';
				}
			}
		}
	}
}
//Dica
function dica(){
	if (textoAtual != null){
		var temp1 = textoAtual;
		var token = temp1.split("_");
		var linha = token[1];
		var coluna = token[2];
		document.getElementById(temp1).value = dadoVetor[linha][coluna];
		//checaPuzzle();
	}
}
//Solução, só que nao ta printando
function solucao(){
	if (textoAtual != null){
		var temp1 = textoAtual;
		var token = temp1.split("_");
		var linha = token[1];
		var coluna = token[2];
		
		// Printa os de cima
		for(j = linha; j >= 0; j--){
			if(dadoVetor[j][coluna] != 0){
				document.getElementById('txt' + '' + j + '' + coluna).value = dadoVetor[j][coluna];
				}else break;
		}
		// Printa os da direita
		for(i = coluna; i< dadoVetor[linha].length; i++){
			if(dadoVetor[linha][i] != 0){
				document.getElementById('txt' + '' + linha + '' + i).value = dadoVetor[linha][i];
				}else break;
		}
		
		// Printa os de baixo
		for(m = linha; m< dadoVetor.length; m++){
			if(dadoVetor[m][coluna] != 0){
				document.getElementById('txt' + '' + m + '' + coluna).value = dadoVetor[m][coluna];
				}else break;
		}
		// Printa elementos da esquerda
		for(k = coluna; k >= 0; k--){
			if(dadoVetor[linha][k] != 0){
				document.getElementById('txt' + '' + linha + '' + k).value = dadoVetor[linha][k];
				}else break;
		}
				
	}
}
