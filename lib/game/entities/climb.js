ig.module
(
    'game.entities.climb'
)
.requires
(
    'impact.entity'
)
.defines(function()
{

    EntityClimb = ig.Entity.extend
    ({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255,233,0,0.5)',
        _wmScalable: true,
        checkAgainst: ig.Entity.TYPE.A,
        
        check: function(other)
        {
            if(other instanceof EntityPlayer)
            {
                other.setupClimbAnimation();
                other.isClimb = true;
            }
        },
    });
});