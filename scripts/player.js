export default class Player extends Phaser.Physics.Arcade.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y, config.key);
    
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.setBounce(0.2);
    this.name = "Player";
    
    this.setSize(25, 50);

    this.input = config.input;
    this.cursors = config.cursors;
    
    this.isReloading = false;
    
    this.speed = 100;
    this.jumpForce = 250;
    this.health = 100;
    this.hunger = 100;
    this.thirst = 100;
    this.sanity = 100;
    this.ammo = 50;
    this.clips = 2;
    
    this.scene.time.delayedCall(60000, () => {
      this.thirst--;
    });
    
    this.scene.time.delayedCall(120000, () => {
      this.hunger--;
    });
  }
  
  update()
  {
    if (this.scene && this)
    {
      let isOnFloor = this.body.touching.down;
      if (this.cursors.right.isDown || this.input.D.isDown)
      {
        this.setVelocityX(this.speed);
        this.flipX = false;
        if (isOnFloor)
          this.anims.play("walk", true);
      } else if (this.cursors.left.isDown || this.input.A.isDown)
      {
        this.setVelocityX(-this.speed);
        this.flipX = true;
        if (isOnFloor)
          this.anims.play("walk", true);
      } else
      {
        this.setVelocityX(0);
        if (isOnFloor)
          this.anims.play("idle", true);
      }
      
      if ((this.cursors.up.isDown||this.input.W.isDown||this.cursors.space.isDown) && isOnFloor)
      {
        this.setVelocityY(-this.jumpForce);
        this.anims.play("jump", true);
      }
      
      if (this.input.R.isDown)
      {
        this.reload();
      }
      
      if (this.hunger <= 0 || this.thirst <= 0)
      {
        this.health -= 0.1;
      }
      
      if (this.y > 2000 || this.health < 0)
      {
        this.destroy();
      }
    }
  }
  
  reload()
  {
    if (this.clips > 0 && this.ammo < 50 &&!this.isReloading)
    {
      this.isReloading = true;
      this.scene.time.delayedCall(2000, () => {
        this.ammo = 50;
        this.clips--;
        this.isReloading = false;
      });
    }
  }
}