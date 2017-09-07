ig.module
(
    'game.entities.player'
)
.requires
(
    'impact.entity'
)
.defines(function(){
    
    EntityPlayer = ig.Entity.extend
    ({
        
        animSheet: new ig.AnimationSheet( 'media/Player.png', 30, 52),
        size: {x: 24, y: 51},
        offset: {x:0, y:0},
        flip: false,
        maxVel: {x: 100, y: 200},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer: null,
        isSwim: false,
        isClimb: false,

        
        init: function(x, y, settings)
        {
            this.startPosition = {x:x, y:y};
            this.parent( x, y, settings );
            this.setupAnimation();
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
        },
        makeInvincible: function()
        {
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        
        receiveDamage: function(amount, from)
        {
            if(this.invincible)
            {
                return;
            }
            this.parent(amount, from);
        },
        
        draw: function()
        {
            if(this.invincible)
            {
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
            }
            this.parent();
        },
        
        kill: function()
        {
            this.parent();
            ig.game.respawnPosition = this.startPosition;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath});
        },
        
        onDeath: function()
        {
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if (ig.game.lives < 0)
            {
                ig.game.gameOver();
            }
            else
            {
                ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
            }
        },
        
        setupAnimation: function()
        {
            this.addAnim('firecracker', 1, [10,11]);
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.07, [1,2,3]);
            this.addAnim('jump', 1, [4]);
            this.addAnim('fall', 0.4, [5]);
            this.addAnim('attack', 0.07, [12,13,14]);
            this.addAnim('flame', 0.07, [15]);
        },
        
        setupSwimAnimation: function()
        {
            this.addAnim('firecracker', 1, [10,11]);
            this.addAnim('idle', 1, [16]);
            this.addAnim('run', 0.07, [17,18,19]);
            this.addAnim('jump', 1, [7]);
            this.addAnim('fall', 0.4, [6]);
            this.addAnim('attack', 0.07, [12,13,14]);
            this.addAnim('flame', 0.07, [15]);              
        },
        
        setupClimbAnimation: function()
        {
            this.addAnim('firecracker', 1, [10,11]);
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.07, [1,2,3]);
            this.addAnim('jump', 0.07, [8,9]);
            this.addAnim('fall', 0.07, [8,9]);
            this.addAnim('attack', 0.07, [12,13,14]);
            this.addAnim('flame', 0.07, [15]);
        },
        
        update: function()
        {
            //move left and right
            var accel = this.standing ? this.accelGround : this.accelAir;
            if (ig.input.state('left') && !ig.input.state('attack') && !ig.input.state('flame') && this.isClimb == false)
            {
                this.accel.x = -accel;
                this.flip = true;
            }
            else if (ig.input.state('right') && !ig.input.state('attack') && !ig.input.state('flame') && this.isClimb == false)
            {
                this.accel.x = accel;
                this.flip = false;
            }
            else
            {
                this.accel.x = 0;
            }
            //climb
            if (this.isClimb == true)
            {
                if (ig.input.pressed('up'))
                {
                    this.accel.y = -accel;
                }
                else if (ig.input.pressed('down'))
                {
                    this.accel.y = accel;
                }
            }
            //jump
            if ((this.standing && ig.input.pressed('jump')) && this.isSwim == false && this.isClimb == false)// && !ig.input.state('attack') && !ig.input.state('flame'))
            {
                this.vel.y = -this.jump;
            }
            if (ig.input.pressed('jump') && this.isSwim == true)
            {
                this.vel.y = -this.jump;
                if (!ig.input.pressed('jump'))
                {
                    this.vel.y = this.vel.y;
                    if (ig.input.pressed('jump'))
                    {
                        this.vel.y = -this.jump;
                    }
                }
            }
            //firecracker
            if (ig.input.pressed('firecracker') && !ig.input.state('flame') && !ig.input.state('attack'))
            {
                this.currentAnim = this.anims.firecracker;
                ig.game.spawnEntity(EntityFirecracker, this.pos.x, this.pos.y, {flip:this.flip});
            }
            //attack
            if (ig.input.state('attack') && !ig.input.state('flame') && !ig.input.state('firecracker'))
            {
                this.currentAnim = this.anims.attack;
                ig.game.spawnEntity(EntityAttack, this.pos.x, this.pos.y, {flip:this.flip});
            }
            //flame
            else if(ig.input.state('flame') && !ig.input.state('attack') && !ig.input.state('firecracker'))
            {
                this.currentAnim = this.anims.flame;
                ig.game.spawnEntity(EntityFlame, this.pos.x, this.pos.y, {flip:this.flip});
                
            }
            //set current animation
            else if (this.vel.y < 0)
            {
                this.currentAnim = this.anims.jump;
            }
            else if (this.vel.y > 0)
            {
                this.currentAnim = this.anims.fall;
            }
            else if (this.vel.x != 0 && this.isClimb == false)
            {
                this.currentAnim = this.anims.run;
            }
            else if (this.vel.x == 0 && this.isClimb == false)
            {
                this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;
            if (this.invincibleTimer.delta() > this.invincibleDelay)
            {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
            //move
            this.parent();
        },
    });
    
    
    
    EntityFlame = ig.Entity.extend
    ({
       size: {x:24,y:12},
      // offset: {x:10, y:-12},
       animSheet: new ig.AnimationSheet('media/flame.png', 24,12),
       type: ig.Entity.TYPE.A,
       checkAgainst: ig.Entity.TYPE.B,
       collides: ig.Entity.COLLIDES.PASSIVE,
       maxVel: {x: 100, y:0},
       
       init: function(x,y,settings)
       {
            this.parent(x + (settings.flip ? -25 : 29), y +25, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            if (this.flip == true)
            {
                this.addAnim('idle', 0.09, [3,4,5]);
            }
            else if (this.flip == false)
            {
                this.addAnim('idle', 0.09, [0,1,2]);
            }
       },
       
       handleMovementTrace: function(res)
       {
            this.parent(res);
            if (!ig.input.state('flame'))
            {
                this.kill();
            }
       },
       
       check: function(other)
       {
            other.receiveDamage(.25, this);
       },
       
       kill: function()
       {
            this.parent();
       }
       
    });
    
    EntityAttack = ig.Entity.extend
    ({
       size: {x:32,y:30},
      // offset: {x:10, y:-12},
       animSheet: new ig.AnimationSheet('media/attack.png', 32,30),
       type: ig.Entity.TYPE.A,
       checkAgainst: ig.Entity.TYPE.B,
       collides: ig.Entity.COLLIDES.PASSIVE,
       maxVel: {x: 0, y:0},
       bounciness: 0,
       friction: {x: 0, y: 0},
       accelGround: 0,
       accelAir: 0,
       
       init: function(x,y,settings)
       {
            this.parent(x + (settings.flip ? -15 : 14), y +10, settings);
            if (this.flip == true)
            {
                this.addAnim('idle', 0.09, [9,10,11,12,13,14,15,16,17]);
            }
            else if (this.flip == false)
            {
                this.addAnim('idle', 0.09, [0,1,2,3,4,5,6,7,8]);
            }
       },
       
       handleMovementTrace: function(res)
       {
            if (!ig.input.state('attack'))
            {
                this.kill();
            }
       },
       
       check: function(other)
       {
            other.receiveDamage(1.75, this);
       },
       
       kill: function()
       {
            this.parent();
       }
       
    });
   
    EntityFirecracker = ig.Entity.extend
    ({
       size: {x:12,y:12},
       animSheet: new ig.AnimationSheet('media/firecracker.png', 12,12),
       type: ig.Entity.TYPE.A,
       checkAgainst: ig.Entity.TYPE.B,
       collides: ig.Entity.COLLIDES.LITE,
       maxVel: {x: 250, y:100},
       offset: {x:0, y:-10},
    //   bounciness: 0,
    //   friction: {x: 250, y: 0},
    //   accelGround: 10,
   //    accelAir: 400,
       
       init: function(x,y,settings)
       {
            this.parent(x + (settings.flip ? -4: 4), y - 1, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim('idle', 0.2, [0,1]);
       },
       
       handleMovementTrace: function(res)
       {
            this.parent(res);
            if (res.collision.x || res.collision.y  )
            {
                this.kill();
            }
       },
       
       check: function(other)
       {
            other.receiveDamage(4, this);
       },
       
       kill: function()
       {
            for(var i = 0; i < 35; i++)
            {
                ig.game.spawnEntity(EntityFirecrackerParticle, this.pos.x, this.pos.y);
            }
            this.parent();
       }
       
    });
    
    EntityDeathExplosion = ig.Entity.extend
    ({
        lifetime: 1,
        callBack: null,
        particles: 100,
    
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            for(var i = 0; i < this.particles; i++)
            {
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            }
            this.idleTimer = new ig.Timer();
        },
        
        update: function()
        {
            if( this.idleTimer.delta() > this.lifetime )
            {
                this.kill();
                if(this.callBack)
                {
                    this.callBack();
                }
                return;
            }
        }
    });
    
    EntityDeathExplosionParticle = ig.Entity.extend
    ({
        size: {x: 4, y: 4},
        maxVel: {x: 160, y: 240},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 220},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 4, 4 ),
        
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function()
        {
            if( this.idleTimer.delta() > this.lifetime )
            {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime,1, 0);
            this.parent();
        }
    });

    EntityFirecrackerParticle = ig.Entity.extend
    ({
        size: {x:4,y:4},
        maxVel: {x:160, y:200},
        lifetime:2,
        fadetime: 1,
        bounciness: 0,
        vel: {x:40,y:90},
        friction:{x:20,y:20},
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet('media/explosion.png',4,4),
        
        init: function(x,y,settings)
        {
            this.parent(x,y,settings);
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random() * 9);
            this.addAnim('idle', 0.2, [frameID]);
            
        },
        
        update: function()
        {
            if (this.idleTimer.delta() > this.lifetime)
            {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1,0);
            this.parent();
        },
    });

});