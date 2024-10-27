import * as PIXI from "pixi.js";
import { Peg, Box } from "./index";
import collisionSound from "../assets/sounds/collisionSound.wav";
import scoreSound from "../assets/sounds/scoreSound.mp3";

export class Play {
  app: PIXI.Application;
  fraction: number;
  pegs: Peg[];
  boxes: Box[];
  finished: boolean;
  costScored: number;
  color: string;
  bet: number;
  time: string;
  boxCost: number;
  topBounce: number;
  sideBounce: number;
  ball: PIXI.Graphics;
  lineOptions: Element[];
  currentGame: { gamesActive: number; currentAmount: number };
  autoPlayButton: HTMLElement;
  playButtonsContainer?: HTMLElement;
  BetAmountContainer?: HTMLElement;

  constructor(
    app: PIXI.Application,
    fraction: number,
    pegs: Peg[],
    boxes: Box[],
    color: string,
    bet: number,
    topBounce: number,
    sideBounce: number,
    currentGame: { gamesActive: number; currentAmount: number },
    lineOptions: Element[],
    autoPlayButton: HTMLElement,

    playButtonsContainer?: HTMLElement,
    BetAmountContainer?: HTMLElement
  ) {
    this.app = app;
    this.fraction = fraction;
    this.pegs = pegs;
    this.boxes = boxes;
    this.finished = false;
    this.costScored = 0;
    this.color = color;
    this.bet = bet;
    this.time = Date().split(" ")[4];
    this.boxCost = 0;
    this.topBounce = topBounce;
    this.sideBounce = sideBounce;
    const ball = new PIXI.Graphics();
    ball.circle(5, 5, 5);
    ball.fill(this.color);
    this.ball = ball;
    this.lineOptions = lineOptions;
    this.currentGame = currentGame;
    this.currentGame.gamesActive++;
    this.autoPlayButton = autoPlayButton;
    this.playButtonsContainer = playButtonsContainer;
    this.BetAmountContainer = BetAmountContainer;

    lineOptions.forEach((el) => {
      el.classList.add("faded-disabled");
    });
    autoPlayButton.classList.add("faded-disabled");
  }

  start(): void {
    this.ball.x = this.pegs[1].x - 8 * this.fraction + 5 * this.fraction;
    this.ball.y = 50 * this.fraction;
    this.ball.width = 50 * this.fraction;
    this.ball.height = 50 * this.fraction;
    let vy = 0;
    let vx = 0;
    this.app.stage.addChild(this.ball);

    let lastPeg: Peg | undefined = undefined;
    let randomTurn: number = Math.floor(Math.random() * 2);

    this.app.ticker.add(() => {
      this.ball.y += vy;
      vy += 0.8;

      for (let pegIndx = 0; pegIndx < this.pegs.length; pegIndx++) {
        if (
          this.collided(
            this.pegs[pegIndx].x - 1 * this.fraction,
            this.pegs[pegIndx].y,
            this.pegs[pegIndx].radius,
            this.ball.x,
            this.ball.y,
            this.ball.width / 2
          )
        ) {
          const collisionSoundEffect = new Audio(collisionSound);
          collisionSoundEffect.volume = 0.2;
          collisionSoundEffect.play();

          const currentPeg = this.pegs[pegIndx];
          vy *= -this.topBounce;
          this.ball.y += vy;
          vx += this.sideBounce;
          vx *= this.fraction;

          if (currentPeg !== lastPeg) {
            randomTurn = Math.floor(Math.random() * 2);
            lastPeg = currentPeg;
          }

          if (randomTurn === 0) {
            this.ball.x -= vx;
          } else if (randomTurn === 1) {
            this.ball.x += vx;
          }

          break;
        }
      }

      for (let boxIndx = 0; boxIndx < this.boxes.length; boxIndx++) {
        if (
          !this.finished &&
          this.collided(
            this.boxes[boxIndx].x,
            this.boxes[boxIndx].y + 40,
            this.boxes[boxIndx].width / 2,
            this.ball.x,
            this.ball.y,
            this.ball.width / 2
          )
        ) {
          if (this.boxes[boxIndx].color !== this.color) {
            return;
          }
          this.finished = true;
          this.currentGame.gamesActive--;
          this.app.stage.removeChild(this.ball);
          const scoredSoundEffect = new Audio(scoreSound);
          scoredSoundEffect.volume = 0.2;
          scoredSoundEffect.play();
          if (this.costScored === 0) {
            this.boxCost = this.boxes[boxIndx].cost;
            this.costScored += this.getScore(this.bet, this.boxCost);

            this.currentGame.currentAmount += this.costScored;

            document.querySelector("#balance-amount")!.innerHTML =
              this.currentGame.currentAmount.toFixed(2);

            const tableGameHistory = window.document.querySelector(
              ".game-history_container"
            ) as HTMLDivElement;

            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.alignItems = "center";
            div.style.backgroundColor = this.color;
            div.style.width = "100%";
            div.style.height = "20px";
            div.style.borderRadius = "5px";
            div.textContent = this.boxCost.toString();
            tableGameHistory.insertBefore(div, tableGameHistory.firstChild);

            this.boxes[boxIndx].box!.y += 10;
            setTimeout(() => {
              this.boxes[boxIndx].box!.y -= 10;
            }, 60);
          }

          if (this.currentGame.gamesActive === 0) {
            this.lineOptions.forEach((el) => {
              el.classList.remove("faded-disabled");
            });
            this.autoPlayButton.classList.remove("faded-disabled");
            this.playButtonsContainer?.classList.remove("faded-disabled");
            this.BetAmountContainer?.classList.remove("faded-disabled");
          }
        }
      }
    });
  }

  collided(
    pegX: number,
    pegY: number,
    pegR: number,
    ballX: number,
    ballY: number,
    ballR: number
  ): boolean {
    const circleDistance =
      (pegX - ballX) * (pegX - ballX) + (pegY - ballY) * (pegY - ballY);
    return circleDistance <= (pegR + ballR) * (pegR + ballR);
  }

  getScore(bet: number, boxCost: number): number {
    return bet * boxCost;
  }
}
