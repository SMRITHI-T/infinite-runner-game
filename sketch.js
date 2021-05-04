var PLAY = 1;
var END = 0;
var gameState = PLAY;
var checkPointSound;
var dieSound;
var jumpSound;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  
  
}

function setup() {
//  createCanvas(600, 200);
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
 // trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score,camera.x+600,50);
  
  console.log("this is ",gameState)
  if(score%100===0&&score>0){
    checkPointSound.play();
    
    
  }
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    trex.velocityX=5;
    camera.position.x=trex.x+600;
    //move the ground
  
    //scoring
    score = score+ Math.round(getFrameRate()/60);
    
    if (ground.x <camera.x-500){
      ground.x = camera.x+50;
    }
    invisibleGround.x=trex.x+100;
    
    //jump when the space key is pressed
    if(touches.length>0 ||keyDown("space")&& trex.y >= height-50) {
        trex.velocityY = -12;
      jumpSound.play();
      touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
      gameOver.x=camera.x;
      restart.x=camera.x;
     
      ground.velocityX = 0;
      trex.velocityY = 0
      trex.velocityX=0;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   
   if(mousePressedOver(restart)||touches.length>0){
     reset();
     touches=[];
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(camera.x+700,height-35,10,40);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1)
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/6;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(camera.x+500,100,40,10);
    cloud.y = Math.round(random(100,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

