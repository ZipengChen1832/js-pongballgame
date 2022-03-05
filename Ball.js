const INIT_SPEED = 0.05;
const INCREMENT_SPEED = 0.002; //after each collision
const MAX_SPEED = 0.27;
const PI = Math.PI;

export default class Ball {
  constructor(ballElem) {
    this.ball = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--x"));
  }
  get y() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--y"));
  }

  set x(value) {
    this.ball.style.setProperty("--x", value);
  }

  set y(value) {
    this.ball.style.setProperty("--y", value);
  }
  
  rect() {
    return this.ball.getBoundingClientRect();
  }

  reset() {
    // console.log("reset");
    this.x = 50;
    this.y = 50;
    this.speed = INIT_SPEED;

    //setting the direction of the ball
    this.angle = Math.random() * 2 * PI;
    while (
      (this.angle > PI / 3 && this.angle < (2 * PI) / 3) ||
      (this.angle > (4 * PI) / 3 && this.angle < (5 * PI) / 3)
    ) {
      this.angle = Math.random() * 2 * PI;
    }
    this.velocity = {
      x: Math.cos(this.angle) * INIT_SPEED,
      y: Math.sin(this.angle) * INIT_SPEED
    };
  }

  update(delta, playerPad, aiPad) {
        //velocity refers to the velocity in physics, i.e. speed with direction
        //velocity is calculated everytime based on the new angle produced by collision 
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;

        const rect = this.rect();

        //ball bounces off top and bottom
        if (rect.top <= 0) {
            //changes direction
            this.angle *= -1;
            this.speed += INCREMENT_SPEED;
        }
        if (rect.bottom >= innerHeight) {
            this.angle *= -1;
            this.speed += INCREMENT_SPEED;
        }

        //determine if the pad touches the ball
        if(isColliding(rect,playerPad.rect())){
            //calculate bounce angle
            this.angle = bounceAngle(playerPad.rect(),rect);
            //resetting x position in order to prevent the ball from getting stuck
            this.x = ( playerPad.rect().right + rect.width / 2 ) / innerWidth * 100; 
            this.speed += INCREMENT_SPEED;
            if(this.speed > MAX_SPEED) this.speed = MAX_SPEED; 
            // console.log(this.speed);
        } else if(rect.left <= 0){
            this.handleLose();
        } 
        
        if(isColliding(rect,aiPad.rect())){
            this.angle = bounceAngle(rect,aiPad.rect());
            this.x = ( aiPad.rect().left - rect.width / 2 ) / innerWidth * 100; 
            this.speed += INCREMENT_SPEED;
            if(this.speed > MAX_SPEED) this.speed = MAX_SPEED; 
            // console.log(this.speed);
        } else if(rect.right >= innerWidth){
            this.handleLose();
        } 
    }

    handleLose(){
        const score1 = document.querySelector("#score1");
        const score2 = document.querySelector("#score2");
        if(this.rect().left <= 0){
            let score = parseInt(score2.textContent) + 1;
            score2.textContent = score;
            
        } else if(this.rect().right >= innerWidth){
            let score = parseInt(score1.textContent) + 1;
            score1.textContent = score;
            
        }
        this.reset();
    }
}    



function isColliding(rect1, rect2) {
    return rect1.right >= rect2.left 
    && rect1.left <= rect2.right 
    && rect1.bottom >= rect2.top
    && rect1.top <= rect2.bottom
}

function bounceAngle(padRect, ballRect){
    const px = (padRect.right + padRect.left) / 2; 
    const py = (padRect.top + padRect.bottom) / 2; 
    const bx = (ballRect.right + ballRect.left) / 2; 
    const by = (ballRect.top + ballRect.bottom) / 2; 
    
    let angle; 
    angle = Math.atan((by-py) / (bx - px));

    //the bounce angle when the ball hits left paddle
    if(bx < innerWidth/2){
        return angle
    }
    
    //the bounce angle when the ball hits right paddle
    //adjust angle due to range of arctan
    return PI - angle;
}
