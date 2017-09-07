ig.module
(
    'game.entities.enemy'
)
.requires
(
    'impact.entity'
)
.defines(function(){

    EntityEnemy = ig.Entity.extend
    ({
        animSheet: new ig.AnimationSheet('media/enemy.png', 30,52),
        size: {x: 24, y:51},
        offset: {x:2,y:0},
        maxVel:{x:100,y:100},
        flip: true,
        friction: {x: 150, y:0},
        speed: 27,
        health: 100,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x,y,settings)
        {
            this.parent(x,y,settings);
            this.addAnim('walk', 0.2, [0,1,2,3]);
        },
        
        update: function()
        {
            if (!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? + 4 : this.size.x - 4), this.pos.y + this.size.y + 1))
            {
                this.flip = !this.flip;
            }
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        
        handleMovementTrace: function(res)
        {
            this.parent(res);
            if (res.collision.x)
            {
                this.flip = !this.flip;
            }
        },
        
        check: function(other)
        {
            other.receiveDamage(10, this);
        },
        
        receiveDamage: function(value)
        {
            this.parent(value);
            if (this.health > 0)
            {
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 5, colorOffset:0});
            }
        },
        
        kill: function()
        {
            this.parent();
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,{colorOffset:0});
            ig.game.stats.kills ++;
        },
    });
});