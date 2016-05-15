const TURN_TIME             = 5000;
const TRASH_PENALTY_TIME    = 5000;
const ALPHABET              = '!!!!!aaaaaaaaabcccddddeeeeeeeeeeeeffgghhhhhhiiiiiiiijkllllmmnnnnnnnnoooooooooppqrrrrrrsssssstttttttttuuuvwwxyyz';

export class Player {
    currentLetter   : string;
    nextLetter      : string;
    timeTillTurn    : number;
    score           : number;
    ready           : boolean;
    lastUpdateTime  : number;
    interval        : number;
    rank            : number;
    
    constructor() {
        this.reset();
    }
    
    reset() {
        this.currentLetter = this.randomLetter();
        this.nextLetter = this.randomLetter();
        this.timeTillTurn = 0;
        this.score = 0;
        this.ready = true;
        this.rank = -1;
    }
    
    beignGame() {
        //clear interval if one.
        clearInterval(this.interval);
        
        //start our update loop
        this.lastUpdateTime = new Date().getTime();
        this.interval = setInterval( () => {   
            var timeNow = new Date().getTime();
            var dt = timeNow - this.lastUpdateTime;
            
            if ( !this.ready ) {
                this.timeTillTurn -= dt;
                if ( this.timeTillTurn <= 0 ){
                    console.log('start turn');
                    this.ready = true;
                }
            }
            
            this.lastUpdateTime = timeNow;
        },500);
    }
    
    timeRemaining():number {
        return this.timeTillTurn;
    }
      //Could move to the following logic serverside for a more secure game but this is a hack, so no need to worry about cheaters
    randomLetter():string{
        return ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
   
    nextTurn(){
        this.ready = false;
        this.timeTillTurn += TURN_TIME;
        this.currentLetter = this.nextLetter,
        this.nextLetter = this.randomLetter()
        console.log('next turn in ', this.timeTillTurn);
    }
    
    skipTurn(){
        console.log('skip turn');
        this.timeTillTurn += TRASH_PENALTY_TIME;
        this.nextTurn();
    }
}
