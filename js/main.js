window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    var background;
    var player;
    var cursors;
    function preload() 
    {
        this.game.load.image('road', 'assets/road.jpg');
        this.game.load.image('car', 'assets/car.png');
    }
    
    
    function create() 
    {
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = this.game.add.tileSprite(0, 0, 800, 600, 'road');
        this.player = game.add.sprite(400, game.world.height - 80, 'car');
        this.game.physics.arcade.enable(this.player);
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() 
    {
        this.background.tilePosition.y += 3;
        this.player.body.velocity.x = 0;
	 
		if (cursors.left.isDown)
		{
			//  Move to the left
			this.player.body.velocity.x = -150;
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			this.player.body.velocity.x = 150;
		}
    }
};
