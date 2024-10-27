import * as PIXI from "pixi.js";

export class Box {
  x: number;
  y: number;
  width: number;
  height: number;
  cost: number;
  box: PIXI.Container | null;
  numberText: PIXI.Text | null;
  color: string;
  selectedLevel: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    cost: number,
    color: string,
    selectedLevel: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cost = cost;
    this.box = null;
    this.numberText = null;
    this.color = color;
    this.selectedLevel = selectedLevel;
  }

  create(): PIXI.Container {
    const box = new PIXI.Graphics();
    box.rect(0, 0, this.width, this.height);
    box.fill(this.color);
    box.x = this.x;
    box.y = this.y;

    this.numberText = new PIXI.Text(this.cost.toString(), {
      fontFamily: "Arial",
      fontSize: 200 / this.selectedLevel,
      fill: 0x000000,
      align: "center",
    });

    this.numberText.anchor.set(0.5);
    this.numberText.x = this.x + this.width / 2;
    this.numberText.y = this.y + this.height / 2;

    const container = new PIXI.Container();
    container.addChild(box);
    container.addChild(this.numberText);
    this.box = container;

    return container;
  }
}
