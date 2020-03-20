import PlayScene from "/scenes/playScene.js";
import GameOver from "/scenes/gameOver.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [PlayScene, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: {y: 350}
    }
  }
};

let game = new Phaser.Game(config);