// ball.js - Ball entity
// This file contains the Ball class that represents the bouncing ball

import { DEFAULTS } from '../constants.js';

export class Ball {
  constructor(game) {
    this.game = game;
    this.size = DEFAULTS.BALL_SIZE;
    this.x = game.width / 2;
    this.y = game.height - 30;
    this.speed = DEFAULTS.BALL_SPEED;
    this.dx = this.speed;
    this.dy = -this.speed;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.size < 0 || this.x + this.size > this.game.width) {
      this.dx = -this.dx;
    }

    if (this.y - this.size < 0) {
      this.dy = -this.dy;
    }

    if (this.y - this.size > this.game.height) {
      this.game.ballLost();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  collidesWith(object) {
    return (
      this.x + this.size > object.x &&
      this.x - this.size < object.x + object.width &&
      this.y + this.size > object.y &&
      this.y - this.size < object.y + object.height
    );
  }

  reset() {
    this.x = this.game.width / 2;
    this.y = this.game.height - 30;
    this.dx = this.speed;
    this.dy = -this.speed;
  }
}