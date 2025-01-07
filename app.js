document.getElementById('startButton').addEventListener('click', function() {
    // Esconder o botão "Jogar"
    document.getElementById('startButton').style.display = 'none';
    
    // Mostrar o canvas do jogo
    document.getElementById('gameContainer').style.display = 'block';
    
    // Iniciar o jogo
    startGame();
  });
  
  function startGame() {
    // Aqui você pode colocar a lógica para iniciar o jogo, como resetar o jogador e o labirinto
    // Chamaremos a função update() para começar a desenhar o labirinto
    update();
  }
  