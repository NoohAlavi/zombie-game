export default class Zombie extends Phaser.Physics.Arcade.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y, config.key);
    
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.setSize(25, 50);
    
    this.damage = config.damage || 0.33;
    this.speed = config.speed || 0.5;
    
    this.state = "passive";
    this.health = config.health || 100;
  }
  
  update()
  {
    let player = this.scene.player;

    switch(this.state)
    {
      case "passive":
        this.anims.play("zombieIdle", true);
        if (Math.abs(player.x - this.x) < 320)
        {
          this.state = "aggressive";
        }
        break;
      case "aggressive":
        this.setVelocityX((player.x - this.x) * this.speed);
        if (this.body.velocity.x > 0)
        {
          this.flipX = false;
        } else
        {
          this.flipX = true;
        }
        this.anims.play("zombieWalk", true);
    }
    
    if (this.health <= 0)
    {
      this.destroy();
    }
  }
}