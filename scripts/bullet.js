export default class Bullet extends Phaser.Physics.Arcade.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y, config.key);
    
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.setScale(0.25, 0.25);
    
    this.speed = config.speed || 0.5;
    
    this.scene.time.delayedCall(10000, () => {
      this.destroy();
    }, [], this);
  }
}