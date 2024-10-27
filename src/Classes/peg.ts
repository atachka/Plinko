import * as PIXI from "pixi.js";

export class Peg {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  pegBall: PIXI.Graphics;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    const peg = new PIXI.Graphics();
    peg.circle(this.width, this.height, this.radius);
    peg.fill("white");
    peg.x = this.x;
    peg.y = this.y;

    this.pegBall = peg;
  }

  create(): PIXI.Graphics {
    return this.pegBall;
  }
}
