//The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.”

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3;

var score = 0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload() {

  boy_running = loadAnimation("1.png","2.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png"); 
  
  boy_collided = loadAnimation("3.png");

 groundImage = loadImage("grass.png");
 

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
 

  gameOverImg = loadImage("gameO.png");
  restartImg = loadImage  ("restart.png");
  
   backgroundImg = loadImage("backgroundImg.png")
  
}

function setup() {
  createCanvas(600, 200);  
  
  ground = createSprite(0, 180, 1200, 85);


 ground.shapeColor="lightgreen"

      

  boy = createSprite(50, 180, 20, 50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.28;

   gameOver = createSprite(300, 100);

  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);



  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 197, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {

  background(backgroundImg);
  text("Score: " + score, camera.position.x-270, 50);
    boy.velocityX=5;
    camera.position.x=boy.x+250

  if (gameState === PLAY) { 
    score = score + Math.round(getFrameRate() / 60);

    if (keyDown("space") && boy.y >= 50) {
      boy.velocityY = -10;
    }

   boy.velocityY = boy.velocityY + 0.9;
 
     ground.width=camera.position.x+600
    ground.x=ground.width/2
    
    invisibleGround.width=ground.width
    invisibleGround.x=invisibleGround.width/2
    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(boy)) {
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
gameOver.x = camera.position.x;
    restart.x=camera.position.x;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    boy.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the boy animation
    boy.changeAnimation("collided", boy_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x%80===0) {
    var cloud = createSprite(camera.position.x+600, 120, 40, 10);
    cloud.y = Math.round(random(40, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (camera.position.x%240===0) {
    var obstacle = createSprite(camera.position.x+500, 153, 10, 40);   

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.09;

    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;


  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  boy.changeAnimation("running", boy_running);

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  score = 0;
}
