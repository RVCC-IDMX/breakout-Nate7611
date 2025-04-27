// paddle.js - Paddle entity
// This file contains the Paddle class that represents the player-controlled paddle

import { DEFAULTS } from '../constants.js';

export class Paddle {
  constructor(game) {
    this.game = game;
    this.width = DEFAULTS.PADDLE_WIDTH;
    this.height = DEFAULTS.PADDLE_HEIGHT;
    this.x = (game.width - this.width) / 2;
    this.y = game.height - this.height - 10;
    this.speed = DEFAULTS.PADDLE_SPEED;
    this.dx = 0;
  }

  update() {
    this.x += this.dx;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.game.width) {
      this.x = this.game.width - this.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.dx = -this.speed;
  }

  moveRight() {
    this.dx = this.speed;
  }

  stop() {
    this.dx = 0;
  }

  setPosition(x) {
    this.x = x - this.width / 2;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.game.width) {
      this.x = this.game.width - this.width;
    }
  }
}