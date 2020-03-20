import Player from '/scripts/player.js';
import Zombie from '/scripts/zombie.js';
import Bullet from "/scripts/bullet.js";
import AmmoBox from "/scripts/ammoBox.js";

export default class PlayScene extends Phaser.Scene
{
  constructor()
  {
    super("PlayScene");
  }
  
  preload()
  {
    this.load.image("ground", "assets/images/ground.png");
    // this.load.image("zombie", "assets/images/zombie.png");
    this.load.image("bullet", "assets/images/bullet.png");
    this.load.image("rock", "assets/images/rock.png");
    this.load.spritesheet("player", "assets/images/playerSpriteSheet.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("zombie", "assets/images/zombieSpriteSheet.png", {
      frameWidth: 64,
      frameHeight: 64
    });
  }
  
  create()
  {
    this.cameras.main.setBackgroundColor("#87CEFA");
    
    this.platforms = this.physics.add.staticGroup({
      key: "ground",
      repeat: Math.floor(1600/32),
      setXY: {
        x: -800,
        y: 564,
        stepX: 32
      }
    });

    this.zombies = this.physics.add.group({
      classType: Zombie
    });
    
    this.player = new Player({
      scene: this,
      x: 64,
      y: 300,
      key: "player",
      cursors: this.input.keyboard.createCursorKeys(),
      input: this.input.keyboard.addKeys("W, A, S, D, R")
    });
    
    this.anims.create({
      key: "idle",
      frames: [{key: "player", frame: 0}],
      frameRate: 8
    });
    
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", {start: 0, end: 3}),
      repeat: -1,
      frameRate: 8
    });
    
    this.anims.create({
      key: "jump",
      frames: [{key: "player", frame: 4}],
      frameRate: 8
    });
    
    this.anims.create({
      key: "zombieIdle",
      frames: [{key: "zombie", frame: 0}]
    });
    
    this.anims.create({
      key: "zombieWalk",
      frames: this.anims.generateFrameNumbers("zombie", {start: 1, end: 4}),
      frameRate: 8
    });
    
    this.rocks = this.physics.add.staticGroup({
      key: "rock",
      repeat: 3,
      setXY: {
        x: Phaser.Math.Between(-800, 800),
        y: 600 - 64,
        stepX: Phaser.Math.Between(-800, 800)
      }
    });
    
    this.rocks.children.each(rock => {
      if (rock.x > 800 || rock.x < -800)
      {
        rock.destroy();
      }
    });
    
    this.bullets = this.physics.add.group({
      classType: Bullet
    });
    
    this.ammoBoxes = this.add.group({
      // key: "ammoBox"
    });
    
    let font = {color: "#000000"};
    
    this.healthText = this.add.text(20, 20, "Health: 100", font);
    this.healthText.setScrollFactor(0);
    
    this.hungerText = this.add.text(20, 40, "Hunger: 100", font);
    this.hungerText.setScrollFactor(0);
    
    this.thirstText = this.add.text(20, 60, "Thirst: 100", font);
    this.thirstText.setScrollFactor(0);
    
    this.ammoText = this.add.text(650, 20, "Ammo: 50/2", font);
    this.ammoText.setScrollFactor(0);
    
    this.physics.add.collider(this.player, this.platforms, null, null, this);
    this.physics.add.collider(this.zombies, this.platforms, null, null, this);
    this.physics.add.collider(this.zombies, this.zombies, this.onZombieCollideZombie, null, this);
    this.physics.add.collider(this.player, this.zombies, this.onPlayerCollideZombie, null, this);
    this.physics.add.overlap(this.bullets, this.zombies, this.onBulletCollideZombie, null, this);
    
    this.physics.add.overlap(this.player, this.ammoBoxes, this.onPlayerOverlapAmmoBox, null, this);
    
    this.input.on("pointerdown", this.shoot, this);
    
    this.spawnZombies();
    this.spawnTimer();
    
    this.cameras.main.startFollow(this.player, 0);
    this.cameras.main.setDeadzone(0, 300);
  }
  
  update()
  {
    if (!this.player.scene)
    {
      this.scene.systems.time.delayedCall(1000, () => {
        this.scene.start("GameOver");
      }, [], this);
    }
    
    this.player.update();
    
    //update HUD
    this.healthText.setText(`Health: ${Math.round(this.player.health) || 0}`);
    this.ammoText.setText(`Ammo: ${this.player.ammo}/${this.player.clips}`);
    this.hungerText.setText(`Hunger: ${this.player.hunger}`);
    this.thirstText.setText(`Thirst: ${this.player.thirst}`);
    
    this.zombies.children.each(zombie => {
      if (this.player.scene || this.player)
        zombie.update();
    });
  }
  
  spawnZombies()
  {
    let newZombie = new Zombie({
      scene: this,
      x: Phaser.Math.Between(-800, 800),
      y: 500,
      key: "zombie"
    });
    while (newZombie.x == this.player.x)
    {
      newZombie.x = Phaser.Math.Between(-800, 800);
    }
    this.zombies.add(newZombie);
    
    this.zombies.children.iterate(zombie => {
      zombie.setBounce(0.2);
      zombie.setMass(1000);
    });
  }
  
  spawnTimer()
  {
    this.scene.systems.time.delayedCall(10000, () => {
      this.spawnZombies();
      this.spawnTimer();
    }, [], this);
  }
  
  onPlayerCollideZombie(player, zombie)
  {
    player.health -= zombie.damage;
  }
  
  onBulletCollideZombie(bullet, zombie)
  {
    zombie.health -= 20;
    zombie.state = "aggressive";
    bullet.destroy();
  }
  
  onZombieCollideZombie(zombie1, zombie2)
  {
    if (zombie1.state == "aggressive" || zombie2.state == "aggressive")
    {
      zombie1.state = zombie2.state = "aggressive";
    }
  }
  
  onPlayerOverlapAmmoBox(player, ammoBox)
  {
    
  }
  
  shoot()
  {
    if (this.player.ammo > 0)
    {
      let pointer = this.input.activePointer;
      let newBullet = new Bullet({
        scene: this,
        x: this.player.x,
        y: this.player.y,
        key: "bullet"
      });
      this.bullets.add(newBullet);
      this.physics.moveTo(newBullet, pointer.worldX, pointer.worldY, 500);
      newBullet.body.setAllowGravity(false);
      
      this.player.ammo--;
    } else
    {
      this.player.reload();
    }
  }
}