//Seleção de elementos
const timer = document.getElementById("timer-selector")
const area = document.getElementById("train-area");
const counterOfHitsText = document.getElementById("hits-counter-text");
const hitContainer = document.getElementById("counter-container");
const counterOfTotalHitsText = document.getElementById("hits-total");
const totalHitContainer = document.getElementById("total-clicks-container");
const counterOfAccuracy = document.getElementById("hits-percentage");
const accuracyContainer = document.getElementById("accuracy-container");
const counterOfTargetFaded = document.getElementById("faded-total");
const targetFadedContainer = document.getElementById("total-targets-faded-container");





//Variaveis de estado do jogo
let counterHits = 0;
let totalHits = 0;
let targetFaded = 0;
let accuracy = 100;
let isPlaying = false;
let intervalo = 0;




//Funções utilitárias
const timerMs = () => parseInt(timer.value) * 1000; //config o tempo
console.log(timer);

let buttonLifeSpan = 1000; //variável de tempo de vida do botão, pode ficar menor ainda. se precisar

function updateStats(){ //update stats
  accuracyMath(); //conta acc
  counterOfHitsText.textContent = counterHits;
  counterOfTotalHitsText.textContent = totalHits;
  counterOfAccuracy.textContent = `${accuracy}%`;
  counterOfTargetFaded.textContent = targetFaded;
  
  
}

hitContainer.addEventListener("animationend", () => { //fica aguardando animation end para remover class
  hitContainer.classList.remove("hit-animate"); 
});

area.addEventListener("click", () => { //contar clicks na area
  if(isPlaying){
    totalHits++;
    updateStats();
  }
});

function accuracyMath(){ //precisão
  if(totalHits == 0){
    accuracy = 100;
    return
  }

  let accCount = (counterHits / totalHits) * 100; //conta
  accuracy = accCount.toFixed(1); //limitando a 1 casa decimal só
};


document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape'){
    stopTraining();
  }
})





//Funções principais
function generateTargets() {
  const button = document.createElement("button");
  button.setAttribute("class", "target");
  button.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede o clique de "vazar" para a área!
    clearTimeout(targetTimer); //remove o timer
    area.removeChild(button); //remove o botão
    totalHits++;
    counterHits++; //soma contador
    console.log(counterHits);
    updateStats();


    hitContainer.classList.add("hit-animate");//trigger na animação de hit do contador
  });

  //timer para remoção
  const targetTimer = setTimeout(function() {
    if (area.contains(button)) {
      area.removeChild(button);
      targetFaded++;
      updateStats();
    }
  }, buttonLifeSpan);

  // Gerar posições aleatórias para o top e left
  let randomTop = Math.random() * (area.offsetHeight - 50);
  let randomLeft = Math.random() * (area.offsetWidth - 50);

  button.style.top = randomTop + 'px';
  button.style.left = randomLeft + 'px';

  area.appendChild(button);
}

function startTraining(){
  if(isPlaying){
    return
  }
  isPlaying = true;
  //zerando as contagens
  counterHits = 0;
  totalHits = 0;
  targetFaded = 0;
  updateStats();
  
  generateTargets();
  
  intervalo = setInterval(generateTargets, 500);
  console.log("iniciou")

  setTimeout(function() {
    stopTraining();
    console.log("encerrou")
  }, timerMs());

}

function stopTraining(){
  clearInterval(intervalo);
  killSection();
}

function killSection(){
  const buttons = document.querySelectorAll(".target")
  isPlaying = false;
  updateStats();

  buttons.forEach(button => {
    area.removeChild(button);
  });

  
}