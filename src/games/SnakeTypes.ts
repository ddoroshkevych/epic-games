class Block {
    public col: number;
    public row: number;
    private blockSize: number;
    constructor(col: number, row: number, blockSize: number) {
        this.col = col;
        this.row = row;
        this.blockSize = blockSize;
    }

    public drawSquare(color: string, ctx: CanvasRenderingContext2D): void {
        const x = this.col * this.blockSize;
        const y = this.row * this.blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.blockSize, this.blockSize);
    }
    private circle(x: number, y: number, radius: number, fillCircle: boolean, ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        if (fillCircle) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    public drawCircle(color: string, ctx: CanvasRenderingContext2D): void {
        const centerX = this.col * this.blockSize + this.blockSize / 2;
        const centerY = this.row * this.blockSize + this.blockSize / 2;
        ctx.fillStyle = color;
        this.circle(centerX, centerY, this.blockSize / 2, true, ctx);
    }

    public equal(otherBlock: Block): boolean {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }

}

class Apple extends Block {

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawCircle("LimeGreen", ctx);
    }
}

const directions:{[key:number]:string} = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

export class Snake {
    private segments: Block[];
    private direction: string;
    private nextDirection: string;
    private ctx: CanvasRenderingContext2D;
    private timeoutID:NodeJS.Timeout;
    private turboBoost: number = 0;
    private timeout: number;
    private score: number = 0;
    private apple:Apple;
    private widthInBlocks;
    private heightInBlocks;
    private blockSize;

    constructor(ctx: CanvasRenderingContext2D, blockSize: number = 10, timeout: number = 200) {
        this.segments = [new Block(7, 5, blockSize), new Block(6, 5, blockSize), new Block(5, 5, blockSize)];
        this.direction = "right";
        this.nextDirection = "right";
        this.apple = new Apple(10,10, blockSize);
        this.ctx = ctx;
        this.blockSize = blockSize;
        this.widthInBlocks = ctx.canvas.width / blockSize;
        this.heightInBlocks = ctx.canvas.height / blockSize;
        this.timeout = timeout;
        this.timeoutID = setTimeout(()=>{},0);
        this.gameLoop = this.gameLoop.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.keyListener = this.keyListener.bind(this);
    }

    private keyListener(event: KeyboardEvent){
        let newDirection = directions[event.keyCode];
        if (newDirection !== undefined) {
          this.setDirection(newDirection);
        }
    }

    public start(){
        this.score = 0;
        this.turboBoost = 0;
        document.body.addEventListener("keydown", this.keyListener);
        this.gameLoop();
    }

    private drawScore(){
        this.ctx.font = "20px Courier";
        this.ctx.fillStyle = "Black";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(
          "Score: " + this.score + "  Turbo: " + this.turboBoost,
          this.blockSize,
          this.blockSize
        );
    }

    private drawBorder(){
        this.ctx.fillStyle = "Gray";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.blockSize);
        this.ctx.fillRect(0, this.ctx.canvas.height - this.blockSize, this.ctx.canvas.width, this.blockSize);
        this.ctx.fillRect(0, 0, this.blockSize, this.ctx.canvas.height);
        this.ctx.fillRect(this.ctx.canvas.width - this.blockSize, 0, this.blockSize, this.ctx.canvas.height);
    }

    private gameLoop(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawScore();
        this.move();
        this.draw();
        this.apple.draw(this.ctx);
        this.drawBorder();
        this.timeoutID = setTimeout(this.gameLoop, this.timeout);
    }

    private draw() {
        for (let i = 0; i < this.segments.length; i++) {
            if (i % 2 === 0) {
                this.segments[i].drawSquare("Blue", this.ctx);
            } else {
                this.segments[i].drawSquare("Red", this.ctx);
            }
        }
    }

    private gameOver() {
        this.ctx.font = "60px Courier";
        this.ctx.fillStyle = "Black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Game Over", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        clearTimeout(this.timeoutID);
    }

    private move() {
        let head = this.segments[0];
        let newHead;

        this.direction = this.nextDirection;

        if (this.direction === "right") {
            newHead = new Block(head.col + 1, head.row, this.blockSize);
        } else if (this.direction === "down") {
            newHead = new Block(head.col, head.row + 1, this.blockSize);
        } else if (this.direction === "left") {
            newHead = new Block(head.col - 1, head.row, this.blockSize);
        } else {
            newHead = new Block(head.col, head.row - 1, this.blockSize);
        }

        if ( this.checkCollision(newHead)) {
            this.gameOver();
            return;
        }

        this.segments.unshift(newHead);

        if (newHead.equal(this.apple)) {
            // Apple is eaten
            this.score++;
            //timeout -= 10;
            this.moveApple();
        } else {
            this.segments.pop();
        }
    }

    private moveApple():void{
        let isAppleOnSnake = false;

        do {
            let randomCol = Math.floor(Math.random() * (this.widthInBlocks - 2)) + 1;
            let randomRow = Math.floor(Math.random() * (this.heightInBlocks - 2)) + 1;

            this.apple = new Apple(randomCol, randomRow, this.blockSize);

            for (let i = 0; i < this.segments.length; i++) {
                if (this.apple.equal(this.segments[i])) {
                    isAppleOnSnake = true;
                    break;
                }
            }
        } while (isAppleOnSnake === true);
    }

    private checkCollision(head: Block): boolean {
        const leftCollision = head.col === 0;
        const topCollision = head.row === 0;
        const rightCollision = head.col === this.widthInBlocks - 1;
        const bottomCollision = head.row === this.heightInBlocks - 1;

        const wallCollision =
            leftCollision || topCollision || rightCollision || bottomCollision;

        let selfCollision = false;
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }

        return wallCollision || selfCollision;
    }

    private setDirection(newDirection: string): void {
        if ((this.direction === "up" && newDirection === "down") ||
            (this.direction === "right" && newDirection === "left") ||
            (this.direction === "down" && newDirection === "up") ||
            (this.direction === "left" && newDirection === "right")) {
            if (this.turboBoost > 0) {
                this.turboBoost--;
                this.timeout += 10;
            }
            return;
        }

        if (this.direction === newDirection) {
            this.timeout -= 10;
            this.turboBoost++;
        }

        this.nextDirection = newDirection;
    }
}