import Phaser from './lib/phaser.js';
import Tetris from './scenes/Tetris.js';
import GameOver from './scenes/GameOver.js'

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'tetris-player1',
    backgroundColor: 0x000000,
    width: GAME_SCENE_WIDTH + HUD_WIDTH,
    height: GAME_SCENE_HEIGHT,
    scene: [Tetris, GameOver]
});
