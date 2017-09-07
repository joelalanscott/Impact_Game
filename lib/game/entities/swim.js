ig.module
(
    'game.entities.swim'
)
.requires
(
    'impact.entity'
)
.defines(function()
{

    EntitySwim = ig.Entity.extend
    ({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255,0,0,0.5)',
        _wmScalable: true,
        checkAgainst: ig.Entity.TYPE.A,
        
        check: function(other)
        {
            if(other instanceof EntityPlayer)
            {
                other.setupSwimAnimation();
                other.isSwim = true;
            }
        },
    });
});