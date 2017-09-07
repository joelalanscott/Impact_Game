ig.module
(
    'game.entities.stopclimb'
)
.requires
(
    'impact.entity'
)
.defines(function()
{

    EntityStopclimb = ig.Entity.extend
    ({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255,0,255,0.5)',
        _wmScalable: true,
        checkAgainst: ig.Entity.TYPE.A,
        
        check: function(other)
        {
            if(other instanceof EntityPlayer)
            {
                other.setupAnimation();
                other.isClimb = false;
                other.accel.y = 0;
            }
        },
    });
});