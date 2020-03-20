export default class GameOver extends Phaser.Scene
{
  constructor()
  {
    super("GameOver");
  }
  
  create()
  {
    this.cameras.main.setBackgroundColor("#FF0000");
    
    this.add.text(300, 200, "GAME OVER", {
      fontSize: 36,
      color: "#000000"
    });
    
    this.restart = this.add.text(350, 300, "Try again", {
      color: "#000000",
      fontSize: 24
    });
    this.restart.setInteractive();
    this.restart.on("pointerup", () => {
      this.scene.start("PlayScene");
    });
  }
}