const app = {};

(function (context) {
  'use strict';

  const levels = [
    {
      map: [
        [1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 1],
        [0, 1, 0, 1, 0]
      ],
      theme: 'lavender',
      player: { x: 0, y: 4 },
      goal: { x: 4, y: 1 }
    },
    {
      map: [
        [1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0]
      ],
      theme: 'green',
      player: { x: 2, y: 4 },
      goal: { x: 4, y: 4 }
    },
    {
      map: [
        [0, 1, 1, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0]
      ],
      theme: 'pink',
      player: { x: 3, y: 0 },
      goal: { x: 4, y: 4 }
    },
    {
      map: [
        [0, 1, 1, 0, 1],
        [0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0]
      ],
      theme: 'mint',
      player: { x: 0, y: 0 },
      goal: { x: 3, y: 4 }
    },
    {
      map: [
        [1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [1, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 0, 1],
      ],
      theme: 'yellow',
      player: { x: 0, y: 3 },
      goal: { x: 3, y: 4 }
    }
  ];

  function Game(id, level) {
    this.el = document.getElementById(id);
    this.level_idx = 0;
    this.tileTypes = ['floor', 'wall'];
    this.tileDim = 6.25;
    this.map = level.map;
    this.theme = level.theme;
    this.player = { ...level.player };
    this.goal = { ...level.goal };
  }

  Game.prototype.createEl = function (x, y, type) {
    const el = document.createElement('div');
    el.className = type;
    el.style.width = el.style.height = this.tileDim + 'rem';
    el.style.left = x * this.tileDim + 'rem';
    el.style.top = y * this.tileDim + 'rem';
    return el;
  };

  Game.prototype.populateMap = function () {
    this.el.className = 'game-container ' + this.theme;
    const tiles = this.el.querySelector('#tiles');
    tiles.innerHTML = ''; // Clear previous tiles

    for (let y = 0; y < this.map.length; ++y) {
      for (let x = 0; x < this.map[y].length; ++x) {
        const tileCode = this.map[y][x];
        const tileType = this.tileTypes[tileCode];
        const tile = this.createEl(x, y, tileType);
        tiles.appendChild(tile);
      }
    }
  };

  Game.prototype.placeSprite = function (type) {
    const x = this[type].x;
    const y = this[type].y;
    const sprite = this.createEl(x, y, type);
    sprite.id = type;
    sprite.style.borderRadius = this.tileDim + 'rem';
    const layer = this.el.querySelector('#sprites');
    layer.appendChild(sprite);
    return sprite;
  };

  Game.prototype.moveLeft = function () {
    if (this.player.x > 0 && this.map[this.player.y][this.player.x - 1] === 0) {
      this.player.x -= 1;
      this.updateHoriz();
    }
  };

  Game.prototype.moveUp = function () {
    if (this.player.y > 0 && this.map[this.player.y - 1][this.player.x] === 0) {
      this.player.y -= 1;
      this.updateVert();
    }
  };

  Game.prototype.moveRight = function () {
    if (this.player.x < this.map[this.player.y].length - 1 && this.map[this.player.y][this.player.x + 1] === 0) {
      this.player.x += 1;
      this.updateHoriz();
    }
  };

  Game.prototype.moveDown = function () {
    if (this.player.y < this.map.length - 1 && this.map[this.player.y + 1][this.player.x] === 0) {
      this.player.y += 1;
      this.updateVert();
    }
  };

  Game.prototype.updateVert = function () {
    this.player.el.style.top = this.player.y * this.tileDim + 'rem';
  };

  Game.prototype.updateHoriz = function () {
    this.player.el.style.left = this.player.x * this.tileDim + 'rem';
  };

  Game.prototype.movePlayer = function (event) {
    if (event.keyCode < 37 || event.keyCode > 40) return;
    
    event.preventDefault();

    switch (event.keyCode) {
      case 37: this.moveLeft(); break;
      case 38: this.moveUp(); break;
      case 39: this.moveRight(); break;
      case 40: this.moveDown(); break;
    }
    this.checkGoal();
  };

  Game.prototype.checkGoal = function () {
    const body = document.querySelector('body');
    if (this.player.y === this.goal.y && this.player.x === this.goal.x) {
      body.className = 'success';
    } else {
      body.className = '';
    }
  };

  Game.prototype.changeLevel = function () {
    this.level_idx = (this.level_idx + 1) % levels.length;
    const level = levels[this.level_idx];
    this.map = level.map;
    this.theme = level.theme;
    this.player = { ...level.player };
    this.goal = { ...level.goal };
  };

  Game.prototype.addMazeListener = function () {
    const map = this.el.querySelector('.game-map');
    map.addEventListener('mousedown', () => {
      if (this.player.y === this.goal.y && this.player.x === this.goal.x) {
        this.changeLevel();
        this.el.querySelectorAll('.layer').forEach(layer => layer.innerHTML = '');
        this.placeLevel();
        this.checkGoal();
      }
    });
  };

  Game.prototype.keyboardListener = function () {
    document.addEventListener('keydown', event => this.movePlayer(event));
  };

  Game.prototype.sizeUp = function () {
    const map = this.el.querySelector('.game-map');
    map.style.height = this.map.length * this.tileDim + 'rem';
    map.style.width = this.map[0].length * this.tileDim + 'rem';
  };

  Game.prototype.placeLevel = function () {
    this.populateMap();
    this.sizeUp();
    this.placeSprite('goal');
    this.player.el = this.placeSprite('player');
    const levelNumber = document.getElementById('level-number');
    if (levelNumber) levelNumber.textContent = 'Level ' + (this.level_idx + 1);
  };

  Game.prototype.addListeners = function () {
    this.keyboardListener();
    this.addMazeListener();
  };

  context.init = function () {
    const myGame = new Game('game-container-1', levels[0]);
    myGame.placeLevel();
    myGame.addListeners();
  };

})(app);

app.init();