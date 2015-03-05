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
    
    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    var background;
    var player;
    var playerEngine;
    var playerCrash;
    
    var candy;
    var goal;
    
    var cursors;
    
   // var level = 1;
    var badCars;
    var cars;
    
    var obstacle;
    
    
    var gameoverText;
    var scoreText;
    var score;
    
    function preload() 
    {
        this.game.load.image('road', 'assets/road.jpg');
        this.game.load.image('car', 'assets/car.png');
        this.game.load.image('candy', 'assets/candycane.png');
        this.game.load.image('redcar', 'assets/redbadcar.png');
        this.game.load.image('bluecar', 'assets/bluebadcar.png');
        this.game.load.image('greencar', 'assets/greenbadcar.png');
        this.game.load.audio('carEngine', 'assets/carEngine.wav');
        this.game.load.audio('crash', 'assets/tiresSqueal.wav');
    }
    
    
    function create() 
    {
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = this.game.add.tileSprite(0, 0, 1000, 600, 'road');
        
        this.player = game.add.sprite(400, game.world.height - 160, 'car');
        this.game.physics.arcade.enable(this.player);
        playerEngine = game.add.audio('carEngine');
	playerEngine.play('', 0, .1, true);
	
        
        cursors = game.input.keyboard.createCursorKeys();
        
        cars = game.add.group();
        cars.enableBody = true;
        
        goal = game.add.group();
        goal.enableBody = true;
        createCandy();
        
        game.time.events.loop(Phaser.Timer.SECOND * 2, createCar, this);
        //game.time.events.loop(Phaser.Timer.SECOND * 4, createCandy, this);
        
        scoreText = game.add.text(0, 0, 'Score: ' + score, { font: "40px Arial", fill: 'red' });
    }
    
    function update() 
    {
    	game.physics.arcade.collide(player, goal, increasePoints, null, this);
    	game.physics.arcade.collide(player, cars, delay, null, this);
    	//game.physics.arcade.collide(player, obstacle, delay, null, this);
    	
        this.background.tilePosition.y += 3;
        this.player.body.velocity.x = 0;
	 
	if (cursors.left.isDown)
	{
		//  Move to the left
		this.player.body.velocity.x = -300;
	}
	else if (cursors.right.isDown)
	{
		//  Move to the right
		this.player.body.velocity.x = 300;
	}
	if (candy.body.position.y >= 700)
	{
		createCandy();
	}
    }
    
    function increasePoints()
    {
    	score++;
	scoreText.text = 'Score: ' + score;
	createCandy();
    }
    
    function createCandy()
    {
    	candy.destroy(true, true);
    	candy = goal.create(game.rnd.integerInRange(0,750), -100, 'candy');   
    }
    
    function createCar()
    {
    	var carColor = game.rnd.integerInRange(0,2);
    	if (carColor == 0)
    	{
    		badCars = cars.create(game.rnd.integerInRange(0,750), -100, 'redcar');
    	}
    	else if (carColor == 1)
    	{
    		badCars = cars.create(game.rnd.integerInRange(0,750), -100, 'bluecar');
    	}
    	else if (carColor == 2)
    	{
    		badCars = cars.create(game.rnd.integerInRange(0,750), -100, 'greencar');
    	}
    	badCars.body.gravity.y = 100;
    }
    
    function delay()
	{
		playerCrash = game.add.audio('crash');
		playerCrash.play();
		game.add.tween(player.rotation).to( {angle: 45}, 2000, Phaser.Easing.Linear.None, false,0, 0, false);
		game.time.events.add(Phaser.Timer.SECOND * 3, gameOver, this).autoDestroy = true;
	}
    
    function gameOver()
    {
    	
	this.game.paused = true;
	gameoverText = game.add.text(500, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
    }
};
