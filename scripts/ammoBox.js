export default class AmmoBox extends Phaser.Physics.Arcade.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y, config.key);
  }
}