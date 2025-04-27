// collision.js - Handles collision detection and response
// This file manages all collision-related logic in the game

import { DEFAULTS } from './constants.js';

export class CollisionManager {
  constructor(game) {
    this.game = game;
  }

  checkCollisions() {
    if (!this.game.ball || !this.game.paddle) {
      return;
    }
    this.checkPaddleCollision();
    this.checkBrickCollisions();
  }

  checkPaddleCollision() {
    const ball = this.game.ball;
    const paddle = this.game.paddle;

    if (
      ball.y + ball.size > paddle.y &&
      ball.y + ball.size < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -ball.speed;

      const hitPosition = (ball.x - paddle.x) / paddle.width;
      ball.dx = ball.speed * (hitPosition * 2 - 1) * 1.5;
    }
  }

  checkBrickCollisions() {
    const ball = this.game.ball;
    for (const brick of this.game.bricks) {
      if (!brick.broken && ball.collidesWith(brick)) {
        brick.break();
        this.game.addScore(DEFAULTS.POINTS_PER_BRICK);
        this.calculateBounceDirection(ball, brick);
        break;
      }
    }
  }

  calculateBounceDirection(ball, brick) {
    const overlapLeft = ball.x + ball.size - brick.x;
    const overlapRight = brick.x + brick.width - (ball.x - ball.size);
    const overlapTop = ball.y + ball.size - brick.y;
    const overlapBottom = brick.y + brick.height - (ball.y - ball.size);

    const minOverlapX = Math.min(overlapLeft, overlapRight);
    const minOverlapY = Math.min(overlapTop, overlapBottom);

    if (minOverlapX < minOverlapY) {
      ball.dx = -ball.dx;
    } else {
      ball.dy = -ball.dy;
    }
  }
}