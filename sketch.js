/*

The Game Project 7 - enemies


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var realPos;

var isLeft;
var isRight;
var isJumping;
var isFalling;

var clouds
var mountains;
var trees;
var houseXs;
var jewels;
var canyons;
var score;
var isWon;
var lives;
var isLost;
var enemies;
var platforms;
var isOnPlatform;

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    score = 0;
    startGame();
    lives=3;
    isLost=false;  
    
}

function startGame()
{
    score = 0;
    
    // Variable to control the background scrolling.
	scrollPos = 0;
    
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	realPos = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isJumping = false;
	isFalling = false;
    isOnPlatform= false;


	// Initialise arrays of scenery objects.
    
    houseXs=[];
    
    for (var i = 0; i < 6; i++)
    {
        houseXs.push ({x_pos: random(0,1000),  y_pos: random (20,10)});        
    }
      
    
    clouds=[];
    
    for (var i = 1; i < 6; i++)
    {
        clouds.push ({x_pos: random(900,500),
                         y_pos: random (20,10)});
    }

    mountains=[];
    
    for (var i = 1; i < 6 ; i++)
    { 
        mountains.push ({x_pos: random(0,1000),      
                         height: random (150, 30)});  
    }
    
    trees=[];
    
    for(var i = 1; i < 10; i++)    
    {
        trees.push ({x_pos: random(0,1000),
                    height: random (100, 150)});
    }
    
    jewels =
    [
        {x_pos: -20, y_pos: 100, size: 50, isFound: false},
        {x_pos: 400, y_pos: 100, size: 50, isFound: false},
        {x_pos: 600, y_pos: 100, size: 50, isFound: false},
        {x_pos: 900, y_pos: 100, size: 50, isFound: false}
    ]
    
    canyons = [
                {xpos: 700,width: 100},
                {xpos: 10,width: 120},
                {xpos: 10,width: 120},
                {xpos: 1150,width: 105}
              ];
    
    enemies=[];
    
    enemies.push(
    {
        x_pos: 20,
        y_pos: floorPos_y,
        x1:20,
        x2:200,
        speed:1,
        size: 30,
        display: function()
        {
            // Draw enemy.
            fill(255, 0, 0);
            ellipse(this.x_pos, this.y_pos, this.size);
        },
        move:function()
        {
            this.x_pos += this.speed;
            if(this.x_pos < this.x1 || this.x_pos > this.x2)
            {
                    //reverse direction
                    this.speed += -1;
            }
        },
        checkCharCollision: function()
        {
            if( abs (realPos - this.x_pos) < 20 &&  abs (gameChar_y - this.y_pos) < 20)
            {
                playerDied();    
            }
        } 
    });
    
    enemies.push(
    {
        x_pos: 200,
        y_pos: floorPos_y,
        x1:20,
        x2:200,
        speed:1,
        size: 30,
        display: function()
        {
            // Draw enemy.
            fill(255, 0, 0);
            ellipse(this.x_pos, this.y_pos, this.size);
        },
        move:function()
        {
            this.x_pos += this.speed;
            if(this.x_pos < this.x1 || this.x_pos > this.x2)
            {
                //reverse direction
                this.speed += -1;
            }
        },
        checkCharCollision: function()
        {
            if( abs (realPos - this.x_pos) < 20 &&  abs (gameChar_y - this.y_pos) < 20)
            {
                  playerDied();    
            }
        } 
    });
    
    
    //platforms 1
    platforms=[];
    
    platforms.push(
    {
        x_pos: 10,
        y_pos: floorPos_y - 100,
        width: 200,
        height: 15,
        display: function()
        {
            // Draw platform.
            fill([255, 255, 0]);
            rect(this.x_pos, this.y_pos, this.width, this.height);
            line(this.x_pos,
                 this.y_pos + this.height / 2,
                 this.x_pos + this.width,
                 this.y_pos + this.height / 2);
        },
        checkCharOn: function() 
        {
            if(realPos - 10>= this.x_pos && realPos  <= this.x_pos - 10 + this.width || realPos + 10>= this.x_pos && realPos  <= this.x_pos + 10 + this.width)
            {
                if(game_char_y + 29 == this.y_pos )
                {
                    isOnPlatform = true;
                    
                
                }
            }
        }
    });
}
 
function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	// Draw clouds.
    push();
    translate(scrollPos*0.5,0);
    drawClouds();
    pop();
    
    
	// Draw mountains.
    push();
    translate(scrollPos,0,0);
    drawMountains();
    pop();
    

	// Draw trees.
    push();
    translate(scrollPos,0,0);
    drawTrees();
    pop();
  
    
	// Draw houses.
    push();
    translate(scrollPos,0,0);
    drawHouses();
    pop();
    

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++){ 
    push();
    translate(scrollPos,0,0);
    drawCanyon (canyons[i]);
    checkCanyon(canyons[i]);
    pop();
    }
        

	// Draw pickup items.
    for(var i = 0; i < jewels.length; i++ ){ 
    push();
    translate(scrollPos,0,0);
    drawJewel(jewels[i]);
    checkJewel(jewels[i]);
    pop();
    }
    
    checkPlayerWon();
    checkPlayerDied();
    
    
    //Draw the enemies
    push();
    translate(scrollPos,0,0);
    for(var i = 0; i < enemies.length; i++)
    {
      enemies[i].display();
      enemies[i].move();
      enemies[i].checkCharCollision();
    }
    pop();
    
    //Draw the platforms
    push();
    translate(scrollPos,0,0);
    for(var i = 0; i < platforms.length; i++)
    {
      platforms[i].display();
      platforms[i].checkCharOn();
    }
    pop();


	// Draw game character.
      drawGameChar();
    
    //Score
    fill(0);
    stroke(0);
    text("Score: " + score, 20,30);
    
    //Life Counter
    fill(0);
    stroke(0);
    text("Lives: " + lives,22,50);
    
    
    if(isWon == true)
        {
      
            fill(255,0,0);
            text("Game over - you won. Press space to continue." , 100,200);
        }
    
    if(isLost == true)
        {
      
            fill(255,0,0);
            text("Game over - you lost. Press space to continue." , 100,400);
        }
    
       

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
			if(gameChar_x > width * 0.2)
			{
					gameChar_x -= 5;
			}
			else
			{
					scrollPos += 5;
			}
	}

	if(isRight)
	{
			if(gameChar_x < width * 0.8)
			{
					gameChar_x  += 5;
			}
			else
			{
					scrollPos -= 5; // negative for moving against the background
			}
	}

	// Logic to make the game character rise and fall.
	if(gameChar_y < floorPos_y)
	{
			gameChar_y += 2;
			isJumping = true;
	}
	else
	{
			isJumping = false;
	}

	if(isFalling)
	{
			gameChar_y += 5;
	}

	// Update real position of gameChar for collision detection.
	realPos = gameChar_x - scrollPos;
}
    



// ---------------------
// Key control functions
// ---------------------


function keyPressed(){

		// console.log(keyCode);
		// console.log(key);
    

	if(key == 'A' || keyCode == 37)
	{
			isLeft = true;
	}

	if(key == 'D' || keyCode == 39)
	{
			isRight = true;
	}

	if(key == ' ' || key == 'W')
	{
			if(!isJumping)
			{
					gameChar_y -= 100;
			}
	}
}


function keyReleased(){

	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	if(isLeft && isJumping){ 
    
        // add your jumping-left code
        
        fill(0);
        rect(gameChar_x , gameChar_y - 10, 15, 10);
        fill(255,0,0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        rect(gameChar_x -20, gameChar_y - 35, 10, 10);
        fill(35);
        rect(gameChar_x - 12, gameChar_y - 20, 15, 10);

    }
    else if(isRight && isJumping){ 
    
        // add your jumping-right code
        
        fill(0);
        rect(gameChar_x -12, gameChar_y - 10, 15, 10);
        fill(255,0,0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        rect(gameChar_x +10, gameChar_y - 35, 10, 10);
        fill(35);
        rect(gameChar_x, gameChar_y - 20, 15, 10);

    }
    else if(isLeft){ 
    
        // add your walking left code
        
        fill(0);
        rect(gameChar_x -12, gameChar_y - 10, 15, 10);
        fill(255,0,0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55,25, 40);
        fill(35);
        rect(gameChar_x, gameChar_y - 10, 15, 10);

    }
    else if(isRight){ 
    
        // add your walking right code
        
        fill(0);
        rect(gameChar_x , gameChar_y - 10, 15, 10);
        fill(255,0,0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        fill(35);
        rect(gameChar_x -12, gameChar_y - 10, 15, 10);

    }
    else if(isJumping || isFalling){ 
    
        // add your jumping facing forwards code
        
        fill(255,0,0);
        rect(gameChar_x - 15, gameChar_y - 55, 30, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55, 40, 40);
        rect(gameChar_x +12, gameChar_y - 35, 10, 10);
        rect(gameChar_x -22, gameChar_y - 35, 10, 10);
        fill(0);
        rect(gameChar_x - 16, gameChar_y - 20, 10, 10);
        rect(gameChar_x + 6, gameChar_y - 20, 10, 10);

    }
    else{ 
    
        // add your standing front facing code
        
        fill(255,0,0);
        rect(gameChar_x - 15, gameChar_y - 55, 30, 50);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 55,40, 40);
        fill(0);
        rect(gameChar_x - 16, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 6, gameChar_y - 10, 10, 10);

}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{ 
   for(var i = 0; i < clouds.length; i++)
    
    {
    fill(255);
    ellipse(clouds[i].x_pos+160, clouds[i].y_pos+100, 70,60);
    ellipse(clouds[i].x_pos+225, clouds[i].y_pos+100,75,60);
    ellipse( clouds[i].x_pos+270, clouds[i].y_pos+100, 60, 50);
    ellipse(clouds[i].x_pos+115,clouds[i].y_pos+100, 55, 45);
    ellipse(clouds[i].x_pos+195, clouds[i].y_pos+70, 41, 35);
    ellipse(clouds[i].x_pos+240, clouds[i].y_pos+70, 41, 35);
    }
}
   


// Function to draw mountains objects.
 function drawMountains()
 { 

    for(var i = 0; i < mountains.length; i++)
         
    {   
    fill(102, 102,102);
    stroke(0,140);
       triangle(mountains[i].x_pos,floorPos_y,mountains[i].x_pos+200,floorPos_y,mountains[i].x_pos+100,mountains[i].height);
                //right moutain
      triangle(mountains[i].x_pos+80,floorPos_y,mountains[i].x_pos+300,floorPos_y,mountains[i].x_pos+170,mountains[i].height);
                //mountain top
    }
 }


// Function to draw trees objects.
 function drawTrees()

{ 
    for(var i = 0; i < trees.length; i++)
        
    { 
    fill(102, 51, 0);
    rect( trees[i].x_pos, floorPos_y-trees[i].height, 30, trees[i].height);
    rect( trees[i].x_pos, floorPos_y-trees[i].height, 30, trees[i].height);
    fill ( 0, 204,0);
    ellipse( trees[i].x_pos,floorPos_y-trees[i].height, 90,90);
  
    }
}


// Function to draw houses objects.
function drawHouses()
{ 
    for(var i = 0; i < houseXs.length; i++)
    {
    fill(204, 102,0);
    rect( houseXs[i].x_pos+37, 315, 140, 120);
    
    fill ( 51, 51, 255);
    rect( houseXs[i].x_pos+45, 320, 45, 40);
    rect ( houseXs[i].x_pos+125, 320, 45, 40);
    rect ( houseXs[i].x_pos+79, 375, 55, 60);
    triangle(houseXs[i].x_pos+35, houseXs[i].y_pos+301, houseXs[i].x_pos+178, houseXs[i].y_pos+301, houseXs[i].x_pos+115, houseXs[i].y_pos+250);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke()
    fill(50,50,0);
    rect(t_canyon.xpos, floorPos_y+1, t_canyon.width, height - floorPos_y);
    

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
// check if the gameChar is over the canyon 
    
    if (realPos > t_canyon.xpos &&  realPos < t_canyon.xpos+t_canyon.width && gameChar_y > floorPos_y-40)
  {
        isFalling = true 
        console.log('canyon')
  }
    
}
  

// ----------------------------------
// Pick-up render and check functions
// ----------------------------------

// Function to draw pick-up objects.
function drawJewel(t_jewel)
{ 
  if (!t_jewel.isFound)
     { 
        noFill();
        strokeWeight(6);
        stroke(220,185,0);
        ellipse(t_jewel.x_pos, floorPos_y -20, 40,40);
        fill(255,0,255);
        stroke(255);
        strokeWeight(1);
        quad(
            t_jewel.x_pos -5,floorPos_y -40,
            t_jewel.x_pos -10, floorPos_y -55,
            t_jewel.x_pos + 10, floorPos_y -55,
            t_jewel.x_pos + 5,floorPos_y -40
        );
        noStroke();
        }
}
    

// Function to check character has picked up an item.
function checkJewel(t_jewel)
{
     if(realPos > t_jewel.x_pos - t_jewel.size/2 && realPos < t_jewel.x_pos + t_jewel.size/2)
    
    {
        if(gameChar_y >=floorPos_y)
        {
            if(!t_jewel.isFound)
            { 
            t_jewel.isFound= true;
            score += 1;
            console.log("score");
            console.log(score);
            }
        }
    }  
    
}

function checkPlayerWon()
{
    if(score == jewels.length)
    {
        isWon=true;
        console.log("you won");
        console.log(score);
        console.log(jewels.length);
    }
}

function checkPlayerDied()
{
    if(gameChar_y > height)
    {
        
         playerDied();
    }
}

function playerDied(){
    
 console.log("you died");
    if(lives > 0)
    { 
      lives-=1;
                  
        startGame();
    }
    else
    {
        isLost=true;

    }
}

function nextLevel()
{
    // DO NOT CHANGE THIS FUNCTION!
    console.log('next level');
}