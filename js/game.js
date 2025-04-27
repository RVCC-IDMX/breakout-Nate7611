// game.js - Main game controller
// Student Task: Implement the Game class for managing game state and main loop

import { Paddle } from './entities/paddle.js';
import { Ball } from './entities/ball.js';
import { Brick } from './entities/brick.js';
import { InputHandler } from './input-handler.js';
import { CollisionManager } from './collision.js';
import { UI } from './ui.js';
import { GAME_STATES, DEFAULTS, BRICK_CONFIG } from './constants.js';

export class Game {
  constructor(canvasId) {
    // Canvas setup
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.gameState = GAME_STATES.START;
    this.score = 0;
    this.lives = DEFAULTS.LIVES;
    this.debugMessage = '';

    this.paddle = null;
    this.ball = null;
    this.bricks = [];

    this.ui = new UI(this);
    this.collisionManager = new CollisionManager(this);
    this.input = new InputHandler(this);

    this.init();

    this.canvasScale = {
      x: this.canvas.width / this.canvas.offsetWidth,
      y: this.canvas.height / this.canvas.offsetHeight
    };

    window.addEventListener('resize', () => {
      this.updateCanvasScale();
    });
  }

  init() {
    this.createEntities();
    this.setupBricks();
    this.ui.showScreen(GAME_STATES.START);
  }

  createEntities() {
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
  }

  updateCanvasScale() {
    this.canvasScale = {
      x: this.canvas.width / this.canvas.offsetWidth,
      y: this.canvas.height / this.canvas.offsetHeight
    };
  }

  setupBricks() {
    this.bricks = [];
    for (let row = 0; row < BRICK_CONFIG.ROWS; row++) {
      for (let col = 0; col < BRICK_CONFIG.COLUMNS; col++) {
        const x = BRICK_CONFIG.OFFSET_LEFT + col * (BRICK_CONFIG.WIDTH + BRICK_CONFIG.PADDING);
        const y = BRICK_CONFIG.OFFSET_TOP + row * (BRICK_CONFIG.HEIGHT + BRICK_CONFIG.PADDING);
        const color = BRICK_CONFIG.COLORS[row % BRICK_CONFIG.COLORS.length];
        this.bricks.push(new Brick(this, x, y, BRICK_CONFIG.WIDTH, BRICK_CONFIG.HEIGHT, color));
      }
    }
  }

  startGame() {
    this.gameState = GAME_STATES.PLAYING;
    this.ui.showScreen(GAME_STATES.PLAYING);
    this.input.setPaddle(this.paddle);
    this.gameLoop();
  }

  restartGame() {
    this.score = 0;
    this.lives = DEFAULTS.LIVES;
    this.createEntities();
    this.setupBricks();
    this.input.setPaddle(this.paddle);
    this.ui.updateStats();
    this.gameState = GAME_STATES.PLAYING;
    this.ui.showScreen(GAME_STATES.PLAYING);
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameState !== GAME_STATES.PLAYING) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.paddle.update();
    this.ball.update();

    this.collisionManager.checkCollisions();

    this.paddle.draw(this.ctx);
    this.ball.draw(this.ctx);

    let remainingBricks = 0;
    this.bricks.forEach(brick => {
      if (!brick.broken) {
        remainingBricks++;
        brick.draw(this.ctx);
      }
    });

    if (remainingBricks === 0) {
      this.win();
      return;
    }

    this.ui.renderDebug(this.ctx, this.debugMessage);

    requestAnimationFrame(() => this.gameLoop());
  }

  ballLost() {
    this.lives--;
    this.ui.updateStats();
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.ball.reset();
    }
  }

  gameOver() {
    this.gameState = GAME_STATES.GAMEOVER;
    this.ui.showScreen(GAME_STATES.GAMEOVER);
  }

  win() {
    this.gameState = GAME_STATES.WIN;
    this.ui.showScreen(GAME_STATES.WIN);
  }

  addScore(points) {
    this.score += points;
    this.ui.updateStats();
  }

  debug(message) {
    this.debugMessage = message;
  }
}