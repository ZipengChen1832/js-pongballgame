import Ball from './Ball.js';
import Paddle from './Paddle.js';

const ball = new Ball(document.querySelector("#ball"));
const playerPad = new Paddle(document.querySelector("#player-pad"));
const aiPad = new Paddle(document.querySelector("#ai-pad"));

let lastTime = 0;
function update(time){
    const delta = time - lastTime;
    lastTime = time;
    ball.update(delta,playerPad,aiPad);
    // aiPad.y = ball.y;
    aiPad.update(ball);
    requestAnimationFrame(update);
}


document.addEventListener("mousemove",e=>{
    playerPad.y = e.y / innerHeight * 100;
    
    //prevents pad from going out of screen
    if(playerPad.rect().top < 0){
        playerPad.y = playerPad.rect().height/2 / innerHeight * 100;
    }
    if(playerPad.rect().bottom > innerHeight){
        playerPad.y = (innerHeight - playerPad.rect().height/2) / innerHeight * 100 ;
    }
})

// const start = function(){
//     setTimeout(()=>{
//         requestAnimationFrame(update);
//     },500)
//     document.removeEventListener("click",start);
// }

// document.addEventListener("click",start)
requestAnimationFrame(update);