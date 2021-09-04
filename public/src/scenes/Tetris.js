import Phaser from '../lib/phaser.js';

export default class Tetris extends Phaser.Scene {
    constructor() {
        super('tetris');
    }

    init() {
        this.dcount = 0;

        this.fieldPiece = [];

        this.nextPiece = [];

        this.drawedNextPiece = [];

        this.allPiece = [
            {
                type: 'S',
                color: 0xff0000,
                shaped: [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0],
                ],
            },
            {
                type: 'Z',
                color: 0xf7f700,
                shaped: [
                    [0, 0, 0],
                    [2, 2, 0],
                    [0, 2, 2],
                ],
            },
            {
                type: 'L',
                color: 0xff00ff,

                shaped: [
                    [3, 0, 0],
                    [3, 3, 3],
                    [0, 0, 0],
                ],
            },
            {
                type: 'J',
                color: 0x00ff00,
                shaped: [
                    [0, 0, 4],
                    [4, 4, 4],
                    [0, 0, 0],
                ],
            },
            {
                type: 'T',
                color: 0x292cff,
                shaped: [
                    [0, 0, 0],
                    [0, 5, 0],
                    [5, 5, 5],
                ],
            },
            {
                type: 'O',
                color: 0x00ffff,
                shaped: [
                    [6, 6],
                    [6, 6],
                ],
            },
            {
                type: 'I',
                color: 0xcacaca,
                shaped: [
                    [0, 0, 0, 0],
                    [7, 7, 7, 7],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
            },
        ];

        this.player = {
            pos: { x: 5, y: 0 },
            piece: this.allPiece[6].shaped,
            pieceType: this.allPiece[6].type,
            color: this.allPiece[6].color,
        };

        this.field = (() => {
            let w = parseInt(GAME_SCENE_WIDTH / BLOCK_WIDTH);
            let h = parseInt(GAME_SCENE_HEIGHT / BLOCK_HEIGHT) + ABOVE_GAP;
            const matrix = [];
            while (h--) {
                matrix.push(new Array(w).fill(0));
            }
            return matrix;
        })();

        window.FIELD_PIECE = this.fieldPiece;
        window.FIELD = this.field;

        this.nextPieceInit = () => {
            for (let i = 0; i < 4; i++) {
                let random = Math.floor(Math.random() * 7);
                this.nextPiece.push({...this.allPiece[random]});
            }
        };

        this.drawNextPiece = nextPiece => {
            nextPiece.forEach((piece, n) => {
                
                const tmpPlayer = {};
                tmpPlayer.piece = piece.shaped;
                tmpPlayer.pieceType = piece.type;
                tmpPlayer.color = piece.color;
                tmpPlayer.pos = { x: GAME_SCENE_WIDTH + 20, y: 250 + 100 * n };
                this.drawedNextPiece.push(this.drawHUDPiece(tmpPlayer))
            });
        };

        this.drawPiece = player => {
            const activePiece = [];
            player.piece.forEach((row, y) => {
                row.forEach((col, x) => {
                    if (col !== 0) {
                        activePiece.push(
                            this.add
                                .rectangle(
                                    (x + player.pos.x) * BLOCK_WIDTH + BLOCK_WIDTH / 2,
                                    (y + player.pos.y - 2) * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
                                    BLOCK_WIDTH,
                                    BLOCK_HEIGHT,
                                    player.color,
                                )
                                .setStrokeStyle(
                                    3,
                                    player.colorBorder ? player.colorBorder : 0xffffff,
                                ),
                        );
                    }
                });
            });
            return activePiece;
        };

        this.drawHUDPiece = player => {
            const activePiece = [];
            player.piece.forEach((row, y) => {
                row.forEach((col, x) => {
                    if (col !== 0) {
                        activePiece.push(
                            this.add
                                .rectangle(
                                    x * BLOCK_WIDTH + BLOCK_WIDTH / 2 + player.pos.x,
                                    y * BLOCK_HEIGHT + BLOCK_HEIGHT / 2 + player.pos.y,
                                    BLOCK_WIDTH,
                                    BLOCK_HEIGHT,
                                    player.color,
                                )
                                .setStrokeStyle(
                                    3,
                                    player.colorBorder ? player.colorBorder : 0xffffff,
                                ),
                        );
                    }
                });
            });
            return activePiece;
        };

        this.drawGuidePiece = (player, field) => {
            let pos = { ...player.pos };
            while (!this.collision({ pos: pos, piece: player.piece }, field)) {
                pos.y++;
            }
            pos.y--;
            return this.drawPiece({
                pos: pos,
                piece: this.player.piece,
                colorBorder: this.player.color,
            });
        };

        this.drawNewPiece = player => {
            const random = Math.floor(Math.random() * 7);
            const newPiece = {...this.nextPiece.shift()};
            player.piece = newPiece.shaped;
            player.pieceType = newPiece.type;
            player.color = newPiece.color;
            this.nextPiece.push(this.allPiece[random]);
            this.drawedNextPiece.forEach(piece => {
                piece.forEach(block => {
                    block.destroy();
                }) 
             })
            this.drawNextPiece(this.nextPiece);
            this.guidePiece = this.drawGuidePiece(player, this.field);
            return this.drawPiece(player);
        };

        this.drawField = field => {
            field.forEach((row, y) => {
                row.forEach((col, x) => {
                    if (col != 0) {
                        this.add.rectangle(
                            x * BLOCK_WIDTH + BLOCK_HEIGHT / 2,
                            y * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
                            BLOCK_WIDTH,
                            BLOCK_HEIGHT,
                            0xffffff,
                        );
                    }
                });
            });
        };

        this.collision = (player, field) => {
            const b = player.piece;
            const o = player.pos;
            for (let y = 0; y < b.length; y++) {
                for (let x = 0; x < b[y].length; x++) {
                    if (b[y][x] !== 0 && (field[y + o.y] && field[y + o.y][x + o.x]) !== 0) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.join = (player, field) => {
            for (let y = 0; y < player.piece.length; y++) {
                // console.log('Y :', y);
                for (let x = 0; x < player.piece[y].length; x++) {
                    const value = player.piece[y][x];
                    if (value !== 0) {
                        field[y + player.pos.y][x + player.pos.x] = value;
                    }
                }
            }
        };

        this.moveBlock = (block, { x, y }) => {
            block.x += BLOCK_WIDTH * x;
            block.y += BLOCK_HEIGHT * y;
        };
        this.movePiece = (piece, offset) => {
            piece.forEach(block => {
                this.moveBlock(block, offset);
            });
            this.guidePiece.forEach(block => {
                block.destroy();
            });
            this.guidePiece = this.drawGuidePiece(this.player, this.field);
        };

        this.collisionBottomHandle = (player, field, activePiece) => {
            player.pos.y--;
            // console.log('before');
            // console.table(field);
            this.join(player, field);
            // console.log('after');
            // console.table(field);
            player.pos.y = -0;
            player.pos.x = 5;
            activePiece.forEach(block => {
                block.field_y = (block.y - BLOCK_HEIGHT / 2) / BLOCK_HEIGHT + ABOVE_GAP;
                this.fieldPiece.push(block);
            });
            this.guidePiece.forEach(block => {
                block.destroy();
            });
            this.checkClearLine(field, this.fieldPiece);
            return this.drawNewPiece(player);
        };

        this.rotateMatrix = (N, mat) => {
            for (let x = 0; x < N / 2; x++) {
                for (let y = x; y < N - x - 1; y++) {
                    let temp = mat[x][y];
                    mat[x][y] = mat[y][N - 1 - x];
                    mat[y][N - 1 - x] = mat[N - 1 - x][N - 1 - y];
                    mat[N - 1 - x][N - 1 - y] = mat[N - 1 - y][x];
                    mat[N - 1 - y][x] = temp;
                }
            }
        };

        this.rotate = (player, field, activePiece) => {
            this.rotateMatrix(player.piece.length, player.piece);
            if (this.collision(player, field)) {
                player.pieceType == 'I'
                    ? player.pos.x < 3
                        ? (this.player.pos.x += 2)
                        : (this.player.pos.x -= 2)
                    : player.pos.x < 3
                    ? (this.player.pos.x += 1)
                    : (this.player.pos.x -= 1);
            }
            activePiece.forEach(block => {
                block.destroy();
            });
            this.guidePiece.forEach(block => {
                block.destroy();
            });
            this.guidePiece = this.drawGuidePiece(player, field);
            return (activePiece = this.drawPiece(player));
        };

        this.clearFieldLine = (clear_y, field) => {
            for (let i = clear_y; i >= 0; i--) {
                if (i == 0) {
                    field[0].map(value => 0);
                } else {
                    field[i] = field[i - 1].slice();
                }
            }
        };

        this.clearPieceLine = (clear_y, fieldPiece) => {
            fieldPiece.forEach((block, y) => {
                if (block.field_y == clear_y) {
                    block.field_y = -1;
                    block.destroy();
                }
                if (block.field_y < clear_y) {
                    block.field_y++;
                    this.moveBlock(block, { x: 0, y: 1 });
                }
            });
        };

        this.checkClearLine = (field, fieldPiece) => {
            // console.log('run clear line');
            let clearFlag = true;
            field.forEach((row, clear_y) => {
                clearFlag = true;
                row.forEach(value => {
                    if (value == 0) clearFlag = false;
                });
                if (clearFlag) {
                    this.clearFieldLine(clear_y, field);
                    this.clearPieceLine(clear_y, fieldPiece);
                }
            });
        };

        this.checkGameOver = field => {
            let checkFlag = false;
            for (let i = 0; i < ABOVE_GAP + 1; i++) {
                field[i].forEach(value => {
                    if (value != 0) {
                        checkFlag = true;
                    }
                });
            }
            return checkFlag;
        };

        this.initInput = () => {
            this.input.keyboard.on('keydown-LEFT', event => {
                this.player.pos.x += -1;
                this.collision(this.player, this.field)
                    ? (this.player.pos.x += 1)
                    : this.movePiece(this.activePiece, { x: -1, y: 0 });
            });

            this.input.keyboard.on('keydown-RIGHT', event => {
                this.player.pos.x += 1;
                this.collision(this.player, this.field)
                    ? (this.player.pos.x += -1)
                    : this.movePiece(this.activePiece, { x: 1, y: 0 });
            });

            this.input.keyboard.on('keydown-DOWN', event => {
                this.player.pos.y++;
                this.collision(this.player, this.field)
                    ? (this.activePiece = this.collisionBottomHandle(
                          this.player,
                          this.field,
                          this.activePiece,
                      ))
                    : this.movePiece(this.activePiece, { x: 0, y: 1 });
            });

            this.input.keyboard.on('keydown-UP', event => {
                this.activePiece = this.rotate(this.player, this.field, this.activePiece);
            });

            this.input.keyboard.on('keydown-SPACE', event => {
                let deltaY = this.player.pos.y;
                let endY = 0;
                while (!this.collision(this.player, this.field)) {
                    endY = this.player.pos.y;
                    this.player.pos.y++;
                }
                deltaY = endY - deltaY;
                this.movePiece(this.activePiece, { x: 0, y: deltaY });
                this.activePiece = this.collisionBottomHandle(
                    this.player,
                    this.field,
                    this.activePiece,
                );
            });
        };
    }

    preload() {
        let graphics = this.add.graphics();
        let line = new Phaser.Geom.Line(GAME_SCENE_WIDTH, 0, GAME_SCENE_WIDTH, GAME_SCENE_HEIGHT);
        graphics.lineStyle(5, 0xffffff);
        graphics.strokeLineShape(line);
        this.scoreText = this.add
            .text(GAME_SCENE_WIDTH + HUD_WIDTH / 2, 10, 'Score', { color: '#ffffff', fontSize: 22 })
            .setOrigin(0.5, 0);
        this.scoreNumberText = this.add
            .text(GAME_SCENE_WIDTH + HUD_WIDTH / 2, 35, 0, { color: '#ffffff', fontSize: 20 })
            .setOrigin(0.5, 0);
        this.keepText = this.add
            .text(GAME_SCENE_WIDTH + HUD_WIDTH / 2, 90, 'HOLD', { color: '#ffffff', fontSize: 24 })
            .setOrigin(0.5, 0);
        this.nextText = this.add
            .text(GAME_SCENE_WIDTH + HUD_WIDTH / 2, 240, 'NEXT', { color: '#ffffff', fontSize: 24 })
            .setOrigin(0.5, 0);
    }

    create() {
        window.test = this.allPiece
        this.nextPieceInit();
        this.activePiece = this.drawNewPiece(this.player);
        this.drawField(this.field);
        this.initInput();
    }

    update(time, deltaTime) {
        if (this.checkGameOver(this.field)) {
            this.scene.start('game-over');
        } else if (this.dcount > 500) {
            this.player.pos.y++;
            this.collision(this.player, this.field)
                ? (this.activePiece = this.collisionBottomHandle(
                      this.player,
                      this.field,
                      this.activePiece,
                  ))
                : this.movePiece(this.activePiece, { x: 0, y: 1 });
            this.dcount = 0;
        }
        this.dcount += deltaTime;
    }
}
