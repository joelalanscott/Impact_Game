ig.module
( 
	'game.main' 
)
.requires
(
	'impact.game',
	'game.levels.level1',
	'game.levels.level2',
	'game.levels.level3',
	'game.entities.swim',
	'game.entities.stopswim',
	'game.entities.climb',
	'game.entities.stopclimb',
	'impact.font',
	'impact.timer'
)
.defines(function()
{

	MyGame = ig.Game.extend
	({
		gravity: 300,
		instructText: new ig.Font('media/04b03.font.png'),
		statText: new ig.Font('media/04b03.font.png'),
		showStats: false,
		statMatte: new ig.Image('media/stat-matte.png'),
		levelTimer: new ig.Timer(),
		levelExit: null,
		stats: {time: 0, kills: 0, deaths: 0},
		lives: 3,
		lifeSprite: new ig.Image('media/life.png'),
		init: function()
		{
			//load first level
			this.loadLevel( LevelLevel1 );
			//bind keys
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.UP_ARROW, 'up');
			ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
			ig.input.bind(ig.KEY.X, 'jump');
			ig.input.bind(ig.KEY.C, 'attack');
			ig.input.bind(ig.KEY.Z, 'firecracker');
			ig.input.bind(ig.KEY.V, 'flame');
			ig.input.bind(ig.KEY.SPACE, 'continue');

		},
	
		update: function()
		{
			//screen follows player
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if (player)
			{
				this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - ig.system.height/2;
			}
			//update all entities and BackgroundMaps
			if (!this.showStats)
			{
				this.parent();
			}
			else
			{
				if (ig.input.state('continue'))
				{
					this.showStats = false;
					this.levelExit.nextLevel();
					this.parent();
				}
			}
		},
	
		draw: function()
		{
			this.parent();
			var x = ig.system.width/2,
			y = ig.system.height - 10;
			this.instructText.draw('Left/Right-Moves, Z-Holy Water, C-Crissaegrim,' , x, y - 10, ig.Font.ALIGN.CENTER);
			this.instructText.draw('V-Hair Spray, X-Jump/Swim, Up/Down-Climb',x,y, ig.Font.ALIGN.CENTER);
			
			if (this.showStats)
			{
				this.statMatte.draw(0,0);
				var x = ig.system.width/2;
				var y = ig.system.height/2 -20;
				this. statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
				this. statText.draw('Time:'+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
				this. statText.draw('Kills:'+this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
				this. statText.draw('Deaths:'+this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
				this. statText.draw('Press Spacebar to Continue', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
			}
			
			this.statText.draw("Lives", 3,3);
			for (var i=0; i < this.lives; i++)
			{
				this.lifeSprite.draw(((this.lifeSprite.width + 2) * i) + 5, 5);
			}
		},
		
		toggleStats: function(levelExit)
		{
			this.showStats = true;
			this.stats.time = Math.round(this.levelTimer.delta());
			this.levelExit = levelExit;
		},
		
		loadLevel: function(data)
		{
			this.stats = {time: 0, kills: 0, deaths: 0};
			this.parent(data);
			this.levelTimer.reset();
		},
		
		gameOver: function()
		{
			ig.finalStats = ig.game.stats;
			ig.system.setGame(GameOverScreen);
		},
	});
	
	StartScreen = ig.Game.extend
	({
		instructText: new ig.Font('media/04b03.font.png'),
		background: new ig.Image('media/screenbg.png'),
		
		init: function()
		{
			ig.input.bind(ig.KEY.SPACE, 'start');	
		},
		
		update: function()
		{
			if(ig.input.pressed('start'))
			{
				ig.system.setGame(MyGame);
			}
			this.parent();
		},
		
		draw: function()
		{
			this.parent();
			this.background.draw(0,0);
			var x = ig.system.width/2,
			y = ig.system.height - 10;
			this.instructText.draw('Press Spacebar to Start' , x+40, y, ig.Font.ALIGN.CENTER);
		},
	});

	GameOverScreen = ig.Game.extend
	({
		instructText: new ig.Font('media/04b03.font.png'),
		gameOver: new ig.Image('media/gameover.png'),
		stats:{},
		
		init: function()
		{
			ig.input.bind(ig.KEY.SPACE, 'start');
			this.stats = ig.finalStats;
		},
		
		update: function()
		{
			if(ig.input.pressed('start'))
			{
				ig.system.setGame(StartScreen);
			}
			this.parent();
		},
		
		draw: function()
		{
			this.parent();
			this.gameOver.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 -20;
			var score = (this.stats.kills * 100);
			this.instructText.draw('Total Kills: ' + this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
			this.instructText.draw('Total Deaths: ' + this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
			this.instructText.draw('Score: ' + score, x, y+50, ig.Font.ALIGN.CENTER);
			this.instructText.draw('Press Spacebar to Continue ' + this.stats.kills, x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
		},
		
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
