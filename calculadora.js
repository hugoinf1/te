let botaoDiv=document.querySelector("#fat button");
let botaoMmc=document.querySelector("#mmc-mdc button");
let botoesLM=document.querySelectorAll(".lermais");

function mudarDetalhesLM(nDoBotao,novoTxt){
  let botaoLM=botoesLM[nDoBotao];
  botaoLM.detalhes=novoTxt;
  if(botaoLM.estado==-1){
    botaoLM.innerHTML="Mostrar"+botaoLM.detalhes+"...";
  }
}

// Fatoração e divisores

function fat(){
  // Forma fatorada
  let input=document.querySelector("#fat input");
  let saida=document.querySelector("#saida-ff");
  let n=parseInt(input.value),nums=0;
  let strings=[],valoresDeN=[n],fatores=[];
  function acharExp(x){
    let exp=0;
    if(x>Math.sqrt(n)){
      exp=1;
      x=n;
      fatores.push(x);
      n=1;
      valoresDeN.push(n);
    }
    else{
      while(n%x===0){
        n/=x;
        fatores.push(x);
        valoresDeN.push(n);
        exp++;
      }
    }
    if(exp!=0){
      strings.push(x+"^"+exp);
      nums++;
    }
  }
  acharExp(2);
  for(let atual=3; n>1; atual+=2){
    acharExp(atual);
  }
  let saidaFinal="";
  for(let i=0; i<nums-1; i++){
    saidaFinal+=strings[i]+" * ";
  }
  saidaFinal+=strings[nums-1];
  saida.innerHTML=saidaFinal;

  // Divisores
  let qtdDeFatores=fatores.length;
  let divDosDivs=document.querySelector("#saida-divs");
  let divs=[1,fatores[0]];
  let nDeDivs=2;
  let divsAnterior=1;
  let levas=[[fatores[0]]];
  for(let i=1; i<qtdDeFatores; i++){
    let divsDessaLeva=[];
    function acrescentarDiv(x){
      divsDessaLeva.push(x);
      divs.push(x);
    }
    if(fatores[i]==fatores[i-1]){
      for(let j=0; j<divsAnterior; j++){
        acrescentarDiv(divs[nDeDivs-divsAnterior+j]*fatores[i]);
      }
    }
    else{
      for(let j=0; j<nDeDivs; j++){
        acrescentarDiv(divs[j]*fatores[i]);
      }
      divsAnterior=nDeDivs;
    }
    levas.push(divsDessaLeva);
    nDeDivs=divs.length;
  }
  divs.sort(function(a,b){return a-b});
  divDosDivs.innerHTML="";
  for(let i=0; i<nDeDivs-1; i++){
    divDosDivs.innerHTML+=(divs[i]+", ");
  }
  divDosDivs.innerHTML+=divs[nDeDivs-1];
  mudarDetalhesLM(0," ("+nDeDivs+")");

  // Procedimento
  let tabela=document.querySelector("#p-divs tbody");
  let htmlTab="<tr><td></td><td></td><td>1</td></tr>";
  for(let i=0; i<qtdDeFatores; i++){
    htmlTab+="<tr><td>"+valoresDeN[i]+"</td><td>"+fatores[i]+"</td><td>";
    let tamLeva=levas[i].length;
    for(let j=0; j<tamLeva-1; j++){
      htmlTab+=(levas[i][j]+", ");
    }
    htmlTab+=levas[i][tamLeva-1];
    htmlTab+="</td></tr>";
  }
  htmlTab+="<tr><td>"+valoresDeN[qtdDeFatores]+"</td></tr>";
  tabela.innerHTML=htmlTab;
  mudarDetalhesLM(1," ("+qtdDeFatores+ (qtdDeFatores==1? " divisão)":" divisões)"));
}
botaoDiv.addEventListener("click",fat);


// MMC e MDC

function mmcmdc(){
  let input=document.querySelector("#mmc-mdc input");
  let saidaMmc=document.querySelector("#saida-mmc");
  let saidaMdc=document.querySelector("#saida-mdc");
  let saidaMmcFf=document.querySelector("#saida-mmc-ff");
  let saidaMdcFf=document.querySelector("#saida-mdc-ff");
  let aviso=document.querySelector("#mmc .aviso");
  let nums=input.value.split(" "),fatores=[],fatoresComuns=[],resultadosDivs=[[]];
  let stringsMmc=[],stringsMdc=[];
  let mmc=1,mdc=1;
  let tam=nums.length;
  for(let i=0; i<tam; i++){
    nums[i]=parseInt(nums[i]);
    resultadosDivs[0][i]=nums[i];
  }

  // Cálculo
  function temAlg1qNaoE1(){
    for(let i=0; i<tam; i++){
      if(nums[i]>1){
        return true;
      }
    }
    return false;
  }
  function dividirPor(x){
    let expMmc=0,expMdc=0;
    while(true){
      let conseguiu=0;
      for(let i=0; i<tam; i++){
        if(nums[i]%x===0){
          nums[i]/=x;
          conseguiu++;
        }
      }
      if(conseguiu>0){
        resultadosDivs.push(Array.from(nums));
        fatores.push(x);
        mmc*=x;
        expMmc++;
        if(conseguiu==tam){
          fatoresComuns.push(x);
          mdc*=x;
          expMdc++;
        }
      }
      else{
        break;
      }
    }
    if(expMmc>0){
      stringsMmc.push(x+"^"+expMmc);
      if(expMdc>0){
        stringsMdc.push(x+"^"+expMdc);
      }
    }
  }
  dividirPor(2);
  for(let atual=3; temAlg1qNaoE1(); atual+=2){
    dividirPor(atual);
  }

  // Exibe resultados
  saidaMmc.innerHTML=mmc;
  saidaMdc.innerHTML=mdc;
  if(mmc>1000000000000000){
    aviso.classList.remove("oculto");
  }
  else{
    aviso.classList.add("oculto");
  }
  let tamMmc=stringsMmc.length;
  let htmlMmc="";
  for(let i=0; i<tamMmc-1; i++){
    htmlMmc+=stringsMmc[i]+" * ";
  }
  htmlMmc+=stringsMmc[tamMmc-1];
  saidaMmcFf.innerHTML=htmlMmc;
  let tamMdc=stringsMdc.length;
  if(tamMdc==0){
    saidaMdcFf.innerHTML="Não se aplica para 1";
  }
  else{
    let htmlMdc="";
    for(let i=0; i<tamMdc-1; i++){
      htmlMdc+=stringsMdc[i]+" * ";
    }
    htmlMdc+=stringsMdc[tamMdc-1];
    saidaMdcFf.innerHTML=htmlMdc;
  }

  // Exibe procedimento
  let tabela=document.querySelector("#p-mmc-mdc tbody");
  let htmlTab="";
  let tamTab=fatores.length;
  let comClasse=0;
  for(let i=0; i<tamTab; i++){
    htmlTab+="<tr><td>";
    for(let j=0; j<tam-1; j++){
      htmlTab+=(resultadosDivs[i][j]+", ");
    }
    htmlTab+=resultadosDivs[i][tam-1]+"</td><td"
    if(fatores[i]==fatoresComuns[comClasse]){
      htmlTab+=" class=\"fator-comum\"";
      comClasse++;
    }
    htmlTab+=">"+fatores[i]+"</td></tr>";
  }
  htmlTab+="<tr><td>";
  for(let i=0; i<tam-1; i++){
    htmlTab+=(resultadosDivs[tamTab][i]+", ");
  }
  htmlTab+=resultadosDivs[tamTab][tam-1]+"</td></tr>";
  tabela.innerHTML=htmlTab;
  mudarDetalhesLM(2," ("+tamTab+ (tamTab==1? " divisão)":" divisões)"));
}
botaoMmc.addEventListener("click",mmcmdc);


// Ler mais

function maisoumenos(e){
  let botaoLM=e.currentTarget;
  if(botaoLM.previousElementSibling.classList.toggle("oculto")){
      botaoLM.innerHTML="Mostrar"+botaoLM.detalhes+"...";
  }
  else{
    botaoLM.innerHTML="Esconder...";
  }
  botaoLM.estado*=-1;
}
let qtd=botoesLM.length;
for(let i=0; i<qtd; i++){
  botoesLM[i].detalhes="";
  botoesLM[i].estado=-1;
  botoesLM[i].addEventListener("click",maisoumenos);
}
