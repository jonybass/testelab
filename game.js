var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("Não foi possível obter o contexto 2D do canvas.");
}
var tileSize = 40; // Tamanho de cada célula do labirinto
var rows = 10;
var cols = 10;
// Posição inicial do jogador
var playerX = 1;
var playerY = 1;
// Posição da saída
var exitX = 8; // Coluna da saída
var exitY = 8; // Linha da saída
// Tempo limite para o jogo (em segundos)
var initialTimeLimit = 60;
var timeLimit = initialTimeLimit;
var timeLeft = timeLimit;
var timerInterval;
// Sistema de pontuação
var score = 0;
// Carregar as imagens
var wallImage = new Image();
var pathImage = new Image();
var exitImage = new Image(); // Imagem da saída
// Definir os caminhos das imagens (substitua pelos seus arquivos)
wallImage.src = "arbusto.jpeg"; // Caminho para a imagem da parede
pathImage.src = "terra.jpeg"; // Caminho para a imagem do caminho
exitImage.src = "porta.jpeg"; // Caminho para a imagem da saída
// Garantir que as imagens sejam carregadas antes de desenhar o labirinto
wallImage.onload = pathImage.onload = exitImage.onload = function () {
    update();
};
// Função para gerar um novo labirinto (simples)
function generateMaze() {
    var newMaze = [];
    // Gerar um labirinto básico com paredes e caminhos
    for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) {
            if (Math.random() < 0.3) {
                row.push(1); // Paredes
            }
            else {
                row.push(0); // Caminho
            }
        }
        newMaze.push(row);
    }
    // Garantir que a posição inicial (1,1) e a posição de saída (8,8) sejam caminhos
    newMaze[0][1] = 0;
    newMaze[rows - 1][cols - 2] = 0;
    // Verificar se a saída é acessível
    if (!isExitAccessible(newMaze)) {
        return generateMaze(); // Regenerar se a saída não for acessível
    }
    return newMaze;
}
// Função para verificar se a saída é acessível através de um algoritmo de busca
function isExitAccessible(maze) {
    var visited = Array.from({ length: rows }, function () { return Array(cols).fill(false); });
    var stack = [{ x: 0, y: 1 }]; // Posição inicial (caminho)
    visited[0][1] = true;
    // Implementando a busca em profundidade (DFS)
    while (stack.length > 0) {
        var _a = stack.pop(), x = _a.x, y = _a.y;
        // Verificar se encontramos a saída
        if (x === exitX && y === exitY) {
            return true;
        }
        // Explorar os vizinhos (cima, baixo, esquerda, direita)
        var directions = [
            { dx: 0, dy: -1 }, // cima
            { dx: 0, dy: 1 }, // baixo
            { dx: -1, dy: 0 }, // esquerda
            { dx: 1, dy: 0 }, // direita
        ];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _b = directions_1[_i], dx = _b.dx, dy = _b.dy;
            var nx = x + dx;
            var ny = y + dy;
            // Verificar se a posição está dentro dos limites e é um caminho não visitado
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                stack.push({ x: nx, y: ny });
            }
        }
    }
    // Se não conseguimos chegar na saída, retornamos false
    return false;
}
// Desenhar o labirinto
function drawMaze(maze) {
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.drawImage(wallImage, col * tileSize, row * tileSize, tileSize, tileSize); // Paredes
            }
            else {
                ctx.drawImage(pathImage, col * tileSize, row * tileSize, tileSize, tileSize); // Caminhos
            }
        }
    }
    // Desenhar a saída
    ctx.drawImage(exitImage, exitX * tileSize, exitY * tileSize, tileSize, tileSize);
}
// Desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(playerX * tileSize + tileSize / 2, playerY * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
    ctx.fill();
}
// Atualizar o tempo restante
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
// Atualizar o placar
function updateScore() {
    var scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = "Pontua\u00E7\u00E3o: ".concat(score);
    }
}
// Lógica de movimento do jogador
function movePlayer(dx, dy) {
    var newX = playerX + dx;
    var newY = playerY + dy;
    // Verificar colisão com paredes
    if (maze[newY] && maze[newY][newX] === 0) {
        playerX = newX;
        playerY = newY;
    }
    // Verificar se o jogador chegou na saída
    if (newX === exitX && newY === exitY) {
        clearInterval(timerInterval);
        score++;
        alert("Parab\u00E9ns! Voc\u00EA chegou \u00E0 sa\u00EDda! Sua pontua\u00E7\u00E3o: ".concat(score));
        timeLimit = Math.max(10, timeLimit - 5); // Reduzir o tempo em 15 segundos, com limite mínimo de 10s
        resetGame();
    }
}
// Detectar teclas pressionadas
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
// Atualizar o canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(maze);
    drawPlayer();
}
// Reiniciar o jogo
function resetGame() {
    // Gerar novo labirinto
    maze = generateMaze();
    // Posição inicial do jogador
    playerX = 1;
    playerY = 1;
    timeLeft = timeLimit;
    update();
    startTimer();
    updateScore();
}
// Iniciar o temporizador
function startTimer() {
    clearInterval(timerInterval);
    // Mostrar o temporizador antes de começar
    var timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.style.display = "block";
    }
    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimer();
    }, 1000);
}
// Exibir o tempo restante e o placar na página
document.body.insertAdjacentHTML("beforeend", '<div id="timer" style="font-size: 20px; margin-top: 10px; display: none;">Tempo restante: 30s</div>');
document.body.insertAdjacentHTML("beforeend", '<div id="score" style="font-size: 20px; margin-top: 10px;">Pontuação: 0</div>');
// Inicializar o jogo
var maze = generateMaze(); // Gerar o primeiro labirinto
update();
