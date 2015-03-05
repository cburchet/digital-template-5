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
    
    
    function preload() 
    {
        game.load.image('road', 'assets/road.jpg');
        game.load.image('car', 'assets/car.png');
        game.load.image('candy', 'assets/candycane.png');
        game.load.image('redcar', 'assets/redbadcar.png');
        game.load.image('bluecar', 'assets/bluebadcar.png');
        game.load.image('greencar', 'assets/greenbadcar.png');
        game.load.image('rock', 'assets/boulder.png');
        game.load.audio('carEngine', 'assets/carEngine.wav');
        game.load.audio('crash', 'assets/tiresSqueal.wav');
    }
    
    var background;
    var player;
    var playerEngine;
    var playerCrash;
    
    var candy;
    var goal;
    
    var cursors;
    
    var speed = 100;
    var badCars;
    var cars;
    var numberCars = 1;
    
    var obstacle;
    var obstacles;
    
    var gameoverText;
    var scoreText;
    var score = 0;
    
    function create() 
    {
    	game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.tileSprite(0, 0, 1000, 600, 'road');
        
        player = game.add.sprite(400, game.world.height - 160, 'car');
        game.physics.arcade.enable(player);
        playerEngine = game.add.audio('carEngine');
	playerEngine.play('', 0, .1, true);
	
        
        cursors = game.input.keyboard.createCursorKeys();
        
        cars = game.add.group();
        cars.enableBody = true;
        obstacles = game.add.group();
        obstacles.enableBody = true;
        
        goal = game.add.group();
        goal.enableBody = true;
        createCandy();
        
        game.time.events.loop(Phaser.Timer.SECOND * 2, createCar, this);
        //game.time.events.loop(Phaser.Timer.SECOND * 4, createCandy, this);
        
        scoreText = game.add.text(0, 0, 'Score: ' + score, { font: "40px Arial", fill: 'red' });
    }
    
    function update() 
    {
    	game.physics.arcade.overlap(player, goal, increasePoints, null, this);
    	game.physics.arcade.collide(player, cars, delay, null, this);
    	//game.physics.arcade.collide(player, obstacle, delay, null, this);
    	
        background.tilePosition.y += 3;
        candy.body.y += 3;
        player.body.velocity.x = 0;
	 
	if (cursors.left.isDown)
	{
		//  Move to the left
		player.body.velocity.x = -300;
	}
	else if (cursors.right.isDown)
	{
		//  Move to the right
		player.body.velocity.x = 300;
	}
	if (candy.body.position.y >= 700)
	{
		createCandy();
	}
    }
    
    function increasePoints()
    {
    	score++;
    	if (score % 5 == 0)
	{
		numberCars++;
	}
	scoreText.text = 'Score: ' + score;
	candy.destroy(true, true);
	createCandy();
    }
    
    function createCandy()
    {
    	candy = goal.create(game.rnd.integerInRange(0,750), -100, 'candy');   
    }
    
    function createCar()
    {
    	var i = numberCars;
    	for (i; i > 0; i--)
    	{
    		var carColor = game.rnd.integerInRange(0,2);
    		var carX = game.rnd.integerInRange(0,750);
    		if (carColor = 0)
    		{
    			badCars = cars.create(carX, game.rnd.integerInRange(75, 300) * -1, 'redcar');	
    		}
    		else if (carColor = 1)
    		{
    			badCars = cars.create(carX, game.rnd.integerInRange(75, 300) * -1, 'bluecar');
    		}
    		else if (carColor = 2)
    		{
    			badCars = cars.create(carX, game.rnd.integerInRange(75, 300) * -1, 'greencar')
    		}
    		var rockX = game.rnd.integerInRange(0,750);
    		obstacle = obstacles.create(rockX, game.rnd.integerInRange(75, 200) * -1, 'rock');
    		if (rockX < 300)
    		{
    			obstacle.body.velocity.x = game.rnd.integerInRange(10, 25);
    		}
    		else if (rockX > 600)
    		{
    			obstacle.body.velocity.x = game.rnd.integerInRange(-10, -25);
    		}
    		else 
    		{
    			obstacle.body.velocity.x = game.rnd.integerInRange(-8, 8);
    		}
    		if (carX < 300)
    		{
    			badCars.body.velocity.x = game.rnd.integerInRange(10, 25);
    		}
    		else if (carX > 600)
    		{
    			badCars.body.velocity.x = game.rnd.integerInRange(-10, -25);
    		}
    		else 
    		{
    			badCars.body.velocity.x = game.rnd.integerInRange(-8, 8);
    		}
    		obstacle.body.gravity.y = speed + (score * .5);
    		badCars.body.gravity.y = speed + (score *.5);
    	}
    }
    
    function delay()
	{
		playerCrash = game.add.audio('crash');
		playerCrash.volume = .2;
		playerCrash.play();
		player.body.gravity.y = 50;
		player.body.angle = -45;
		game.time.events.add(Phaser.Timer.SECOND * 3, gameOver, this).autoDestroy = true;
	}
    
    function gameOver()
    {
    	
	this.game.paused = true;
	gameoverText = game.add.text(500, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
    }
};
