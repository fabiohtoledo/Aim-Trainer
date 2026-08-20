// ==========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================
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
const timerCounter = document.getElementById("timer-counter");
const inputTimerAllButtons = document.querySelectorAll(".spinner-buttons > button")
const btnUp = document.getElementById("btn-timer-up");
const btnDown = document.getElementById("btn-timer-down");








//Variaveis de estado do jogo
let counterHits = 0;
let totalHits = 0;
let targetFaded = 0;
let accuracy = 100;
let isPlaying = false;
let generatorInterval = 0;
let finishTimeout = null;
let countdown = 0;
let countdownNumber = timer.valueAsNumber;

// ==========================================
// LÓGICA DA SIDEBAR / NAVEGAÇÃO
// ==========================================
const sidebarLink =  document.querySelectorAll(".sidebar-link");
console.log(sidebarLink);


let sidebarActiveNow = document.getElementById("personalized");


sidebarLink.forEach(link => {
  link.addEventListener('click', () => {
    sidebarActiveNow.classList.remove("sb-active");
    link.classList.add("sb-active");
    sidebarActiveNow = link;
  })
})




// ==========================================
// LÓGICA DO JOGO E DA ARENA
// ==========================================


//Funções utilitárias
const timerMs = () => parseInt(timer.value) * 1000; //config o tempo

let buttonLifeSpan = 1000; //variável de tempo de vida do botão, pode ficar menor ainda. se precisar

function updateStats(){ //update stats
  accuracyMath(); //conta acc
  counterOfHitsText.textContent = counterHits;
  counterOfTotalHitsText.textContent = totalHits;
  counterOfAccuracy.textContent = `${accuracy}%`;
  counterOfTargetFaded.textContent = targetFaded;
  timerCounter.textContent = `${countdownNumber}s`
  
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
    stopTraining(); //para ao apertar ESC
  }
})





function countDownTheTimer(){ //Contador de timer no html
  countdownNumber--;
  updateStats();
}

timer.addEventListener('change', () => {
  // O evento 'change' dispara quando o usuário finaliza a digitação (perde o foco)
  if (timer.valueAsNumber < 1 || isNaN(timer.valueAsNumber)) {
    timer.value = 1; // Corrige o texto visível no input para 1
    countdownNumber = 1;
  }else{
    countdownNumber = timer.valueAsNumber;
  }
    updateStats();
});

// Quando clicar na seta PARA CIMA
btnUp.addEventListener('click', () => {
  timer.stepUp();             // Aumenta +1 no input
  countdownNumber = timer.valueAsNumber; // Sincroniza a variável
  updateStats();              // Atualiza a tela
});

// Quando clicar na seta PARA BAIXO
btnDown.addEventListener('click', () => {
  timer.stepDown();           // Diminui -1 no input
  countdownNumber = timer.valueAsNumber; // Sincroniza a variável
  updateStats();              // Atualiza a tela
});

function disableTimerInput(){
  inputTimerAllButtons.forEach(button => {
    button.disabled = true;
  })

  timer.disabled = true;
}

function enableTimerInput(){
  inputTimerAllButtons.forEach(button => {
    button.disabled = false;
  })

  timer.disabled = false;
}




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
  disableTimerInput();
  isPlaying = true;
  //zerando as contagens
  counterHits = 0;
  totalHits = 0;
  targetFaded = 0;
  updateStats();
  
  generateTargets();
  
  generatorInterval = setInterval(generateTargets, 500);
  console.log(timer.value);
  console.log("iniciou");
  countdownNumber = timer.valueAsNumber;
  countdown = setInterval(countDownTheTimer, 1000);

  finishTimeout = setTimeout(function() {
    stopTraining();
    console.log("encerrou");
  }, timerMs());

}

function stopTraining() {
  isPlaying = false; // 1. Interrompe a lógica de cliques e eventos imediatamente

  // 2. Limpa todos os agendamentos pendentes
  clearInterval(generatorInterval);
  clearInterval(countdown);
  clearTimeout(finishTimeout);

  // 3. Restaura interface e estado
  enableTimerInput();
  countdownNumber = timer.valueAsNumber;
  
  // 4. Remove elementos da tela e atualiza estatísticas finais
  killSection(); 
}

function killSection(){
  const buttons = document.querySelectorAll(".target")
  updateStats();

  buttons.forEach(button => {
    area.removeChild(button);
  });

  
}









