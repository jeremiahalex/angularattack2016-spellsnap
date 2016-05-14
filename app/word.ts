export class Word {
  y: number;
  x: number;
  isWord: boolean;
  isClaimed: boolean;
  content: string;
  downards: boolean;
  
  constructor(x:number, y:number, content:string, downards:boolean = false){
      this.x = x;
      this.y = y; 
      this.isWord = this.isClaimed = false;
      this.content = content;
      this.downards = downards;
  }
  
  length():number {
      return this.content.length;
  }
  
  points():number {
      //for now points are 2^length
      return Math.pow(2,this.length());
  }
}