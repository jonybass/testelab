# labirnto código texte.

 1. Configuração do Canvas e Contexto
Javascript-escritor

Copiar código
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("Não foi possível obter o contexto 2D do canvas.");
}
canvas : A variável obtida do elemento <canvas>HTML.
ctx : O contexto 2D do canvas é usado para desenhar no jogo. Se o contexto não for obtido corretamente, um erro será lançado.
2. Configuração do Labirinto
Javascript-escritor

Copiar código
var tileSize = 40; // Tamanho de cada célula do labirinto
var rows = 10;
var cols = 10;
tileSize : Define o tamanho de cada célula do labirinto (40 pixels).
rows e cols : Definem o número de linhas e colunas no labirinto (10x10).
3. Posições do Jogador e de Saída
Javascript-escritor

Copiar código
var playerX = 1;
var playerY = 1;
var exitX = 8;
var exitY = 8;
playerX e playerY : A posição inicial do jogador no labirinto (célula (1,1)).
exitX e exitY : A posição da saída (célula (8,8)).
4. Controle de Tempo
Javascript-escritor

Copiar código
var initialTimeLimit = 60;
var timeLimit = initialTimeLimit;
var timeLeft = timeLimit;
var timerInterval;
inicialTimeLimit : Define o tempo inicial disponível para o jogo (60 segundos).
timeLeft : Variável que controla o tempo restante.
timerInterval : Armazena o intervalo do temporizador que será usado para atualizar o tempo restante.
5. Carregamento de Imagens
Javascript-escritor

Copiar código
var wallImage = new Image();
var pathImage = new Image();
var exitImage = new Image();
wallImage.src = "arbusto.jpeg";
pathImage.src = "terra.jpeg";
exitImage.src = "porta.jpeg";
São imagens criadas para representar as paredes, os caminhos e a saída do labirinto. As imagens são transmitidas a partir dos arquivos fornecidos.
6. Função generateMazepara Gerar o Labirinto
Javascript-escritor

Copiar código
function generateMaze() {
    var newMaze = [];
    // Gerar um labirinto básico com paredes e caminhos
    for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) {
            if (Math.random() < 0.3) {
                row.push(1); // Paredes
            } else {
                row.push(0); // Caminho
            }
        }
        newMaze.push(row);
    }
    // Garantir que a posição inicial e a saída sejam caminhos
    newMaze[0][1] = 0;
    newMaze[rows - 1][cols - 2] = 0;
    // Verificar se a saída é acessível
    if (!isExitAccessible(newMaze)) {
        return generateMaze(); // Regenerar se a saída não for acessível
    }
    return newMaze;
}
A função generateMaze cria um labirinto aleatório com um padrão básico, onde as células podem ser 1 (parede) ou 0 (caminho).
Garantimos que as células de início e saída sejam sempre caminhos.
isExitAccessible verifica se a saída pode ser obtida a partir do início utilizando um algoritmo de busca (descrito mais adiante).
7. FunçãoisExitAccessible
Javascript-escritor

Copiar código
function isExitAccessible(maze) {
    var visited = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    var stack = [{ x: 0, y: 1 }];
    visited[0][1] = true;
    while (stack.length > 0) {
        var { x, y } = stack.pop();
        if (x === exitX && y === exitY) {
            return true;
        }
        var directions = [
            { dx: 0, dy: -1 }, // cima
            { dx: 0, dy: 1 },  // baixo
            { dx: -1, dy: 0 }, // esquerda
            { dx: 1, dy: 0 },  // direita
        ];
        for (var { dx, dy } of directions) {
            var nx = x + dx;
            var ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                stack.push({ x: nx, y: ny });
            }
        }
    }
    return false;
}
isExitAccessible verifica, utilizando uma busca em profundidade (DFS), se a saída é obtida a partir da posição inicial.
8. Funções de Desenho
Javascript-escritor

Copiar código
function drawMaze(maze) {
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.drawImage(wallImage, col * tileSize, row * tileSize, tileSize, tileSize); // Paredes
            } else {
                ctx.drawImage(pathImage, col * tileSize, row * tileSize, tileSize, tileSize); // Caminhos
            }
        }
    }
    ctx.drawImage(exitImage, exitX * tileSize, exitY * tileSize, tileSize, tileSize); // Desenhar saída
}
drawMaze desenha o labirinto no canvas, usando como imagens de paredes e caminhos. A saída também é desenhada.
9. Função de Movimento do Jogador
Javascript-escritor

Copiar código
function movePlayer(dx, dy) {
    var newX = playerX + dx;
    var newY = playerY + dy;
    if (maze[newY] && maze[newY][newX] === 0) {
        playerX = newX;
        playerY = newY;
    }
    if (newX === exitX && newY === exitY) {
        clearInterval(timerInterval);
        score++;
        alert("Parabéns! Você chegou à saída! Sua pontuação: ".concat(score));
        timeLimit = Math.max(10, timeLimit - 5);
        resetGame();
    }
}
movePlayer permite ao jogador se mover no labirinto ao detectar as teclas de seta (cima, baixo, esquerda, direita).
Também verifica se o jogador chegou à saída, o que atualiza a pontuação, diminui o tempo limite e reinicia o jogo.
10. Função de Temporizador
Javascript-escritor

Copiar código
function updateTimer() {
    var timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.textContent = "Tempo restante: ".concat(timeLeft, "s");
    }
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Fim de jogo! O tempo acabou.");
        resetGame();
    }
}
updateTimer atualiza o tempo restante na tela a cada segundo. Se o tempo acabar, o jogo será reiniciado.
11. Interação com o Usuário
Javascript-escritor

Copiar código
window.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":
            movePlayer(0, -1);
            break;
        case "ArrowDown":
            movePlayer(0, 1);
            break;
        case "ArrowLeft":
            movePlayer(-1, 0);
            break;
        case "ArrowRight":
            movePlayer(1, 0);
            break;
    }
    update();
});
keydown detecta quando uma tecla de direção é pressionada e chama a função movePlayerpara mover o jogador.
12. Funções de Inicialização e Reinício
Javascript-escritor

Copiar código
function resetGame() {
    maze = generateMaze();
    playerX = 1;
    playerY = 1;
    timeLeft = timeLimit;
    update();
    startTimer();
    updateScore();
}
resetGame reinicia o jogo, gerando um novo labirinto, reposicionando o jogador e reiniciando o cronômetro.
Javascript-escritor

Copiar código
function startTimer() {
    clearInterval(timerInterval);
    var timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.style.display = "block";
    }
    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimer();
    }, 1000);
}
startTimer inicia o temporizador, diminuindo o tempo restante a cada segundo.
13. Exibição do Tempo e Pontuação
Javascript-escritor

Copiar código
document.body.insertAdjacentHTML("beforeend", '<div id="timer" style="font-size: 20px; margin-top: 10px; display: none;">Tempo restante: 30s</div>');
document.body.insertAdjacentHTML("beforeend", '<div id="score" style="font-size: 20px; margin-top: 10px;">Pontuação: 0</div>');
Exibe o tempo restante e a pontuação na página, logo abaixo do canvas.
14. Inicialização do Jogo
Javascript-escritor

Copiar código
var maze = generateMaze();
update();
labirinto é gerado e o jogo é iniciado acionando a função updatepara desenhar o labirinto e o jogador.
Esse é o funcionamento básico do código. Ele cria um jogo de labirinto dinâmico, com mecânicas de tempo e pontuação, onde o jogador deve chegar à saída dentro do limite de tempo.
