import React, { useEffect, useRef, useState, useCallback } from 'react';
import './GameCanvas.css';

interface GameCanvasProps {
    onGameEnd?: (score: number) => void;
    difficulty?: 'easy' | 'medium' | 'hard';
}

import { useNavigate } from 'react-router';

interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    isJumping: boolean;
    isSliding: boolean;
    velocityY: number;
    groundY: number;
    normalHeight: number;
    slideHeight: number;
    direction: number;
}

interface Obstacle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    passed: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameEnd, difficulty = 'medium' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();
    const [score, setScore] = useState<number>(0);
    const [combo, setCombo] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    const NORMAL_HEIGHT = 38;
    const SLIDE_HEIGHT = 18;
    const PLAYER_WIDTH = 28;
    const JUMP_POWER = -12;
    const GRAVITY = 0.7;
    const MOVE_SPEED = 5;

    const goToMenu = () => {
        navigate('/menu');
    };

    const gameStateRef = useRef({
        player: {
            x: 200,
            y: 0,
            width: PLAYER_WIDTH,
            height: NORMAL_HEIGHT,
            isJumping: false,
            isSliding: false,
            velocityY: 0,
            groundY: 350,
            normalHeight: NORMAL_HEIGHT,
            slideHeight: SLIDE_HEIGHT,
            direction: 1
        } as Player,
        obstacles: [] as Obstacle[],
        minX: 50,
        maxX: 750,
        frame: 0,
        slideEndTime: 0,
        beatIntensity: 0,
        keys: {
            left: false,
            right: false
        }
    });

    const difficultySettings = {
        easy: { obstacleDensity: 0.6, scoreMultiplier: 1 },
        medium: { obstacleDensity: 0.8, scoreMultiplier: 1.5 },
        hard: { obstacleDensity: 1.0, scoreMultiplier: 2 }
    };

    const settings = difficultySettings[difficulty];

    const ObstacleType = {
        JUMP: 'jump',
        SLIDE: 'slide'
    };

    const generateMap = useCallback(() => {
        const obstacles: Obstacle[] = [];
        const player = gameStateRef.current.player;
        const startX = 400;
        const endX = 700;
        const spacing = 200;

        let typeIndex = 0;
        for (let x = startX; x <= endX; x += spacing) {
            let type: string;
            if (typeIndex % 2 === 0) {
                type = ObstacleType.JUMP;
            } else {
                type = ObstacleType.SLIDE;
            }
            typeIndex++;

            let obstacleY: number;
            const obstacleWidth = 30;
            const obstacleHeight = 30;

            if (type === ObstacleType.JUMP) {
                obstacleY = player.groundY - obstacleHeight + 8;
            } else {
                obstacleY = player.groundY - obstacleHeight - 25;
            }

            obstacles.push({
                id: Date.now() + x,
                x: x,
                y: obstacleY,
                width: obstacleWidth,
                height: obstacleHeight,
                type: type,
                passed: false
            });
        }

        return obstacles;
    }, []);

    const jump = useCallback(() => {
        const player = gameStateRef.current.player;
        const now = Date.now();

        if (!player.isJumping && !player.isSliding && now > gameStateRef.current.slideEndTime) {
            player.isJumping = true;
            player.velocityY = JUMP_POWER;
        }
    }, []);

    const slide = useCallback(() => {
        const player = gameStateRef.current.player;
        const now = Date.now();

        if (!player.isSliding && !player.isJumping && now > gameStateRef.current.slideEndTime) {
            player.isSliding = true;
            player.height = SLIDE_HEIGHT;
            player.y = player.groundY - SLIDE_HEIGHT + 5;
            gameStateRef.current.slideEndTime = now + 450;

            setTimeout(() => {
                if (gameStateRef.current.player.isSliding) {
                    gameStateRef.current.player.isSliding = false;
                    gameStateRef.current.player.height = NORMAL_HEIGHT;
                    gameStateRef.current.player.y = gameStateRef.current.player.groundY - NORMAL_HEIGHT + 5;
                }
            }, 450);
        }
    }, []);

    const moveLeft = useCallback(() => {
        const player = gameStateRef.current.player;
        const newX = player.x - MOVE_SPEED;
        if (newX >= gameStateRef.current.minX) {
            player.x = newX;
            player.direction = -1;
        }
    }, []);

    const moveRight = useCallback(() => {
        const player = gameStateRef.current.player;
        const newX = player.x + MOVE_SPEED;
        if (newX + player.width <= gameStateRef.current.maxX) {
            player.x = newX;
            player.direction = 1;
        }
    }, []);

    const checkCollision = useCallback((player: Player, obstacle: Obstacle) => {
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;

        return playerLeft < obstacleRight &&
            playerRight > obstacleLeft &&
            playerTop < obstacleBottom &&
            playerBottom > obstacleTop;
    }, []);

    const updateGame = useCallback(() => {
        const state = gameStateRef.current;
        const canvas = canvasRef.current;
        if (!canvas || isGameOver) return;

        const player = state.player;

        if (state.keys.left) {
            moveLeft();
        }
        if (state.keys.right) {
            moveRight();
        }

        if (player.isJumping) {
            player.velocityY += GRAVITY;
            player.y += player.velocityY;

            if (player.y >= player.groundY - player.height + 5) {
                player.y = player.groundY - player.height + 5;
                player.isJumping = false;
                player.velocityY = 0;
            }
        }

        if (player.isSliding) {
            player.y = player.groundY - SLIDE_HEIGHT + 5;
        } else if (!player.isJumping) {
            player.y = player.groundY - player.height + 5;
        }

        for (let i = 0; i < state.obstacles.length; i++) {
            const obstacle = state.obstacles[i];

            if (obstacle.passed) continue;

            const isColliding = checkCollision(player, obstacle);

            if (isColliding) {
                let isCorrectAction = false;
                if (obstacle.type === ObstacleType.JUMP && player.isJumping) {
                    isCorrectAction = true;
                } else if (obstacle.type === ObstacleType.SLIDE && player.isSliding) {
                    isCorrectAction = true;
                }

                if (!isCorrectAction) {
                    setIsGameOver(true);
                    if (onGameEnd) onGameEnd(score);
                    return;
                }
            }

            if (player.x > obstacle.x + obstacle.width) {
                obstacle.passed = true;
                const points = Math.floor(100 * settings.scoreMultiplier);
                setScore(prev => prev + points);
            }
        }

        state.beatIntensity = (Math.sin(Date.now() * 0.008) + 1) / 2;
        state.frame++;
    }, [isGameOver, checkCollision, onGameEnd, moveLeft, moveRight, settings.scoreMultiplier]);

    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const state = gameStateRef.current;
        const player = state.player;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#F0E68C');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.ellipse(150, 60, 40, 30, 0, 0, Math.PI * 2);
        ctx.ellipse(190, 50, 35, 28, 0, 0, Math.PI * 2);
        ctx.ellipse(110, 55, 35, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(600, 80, 45, 32, 0, 0, Math.PI * 2);
        ctx.ellipse(650, 70, 38, 28, 0, 0, Math.PI * 2);
        ctx.ellipse(560, 75, 38, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8B5A2B';
        ctx.fillRect(0, player.groundY - 5, canvas.width, canvas.height - player.groundY + 10);
        ctx.fillStyle = '#6B3E1A';
        ctx.fillRect(0, player.groundY - 3, canvas.width, 8);

        ctx.fillStyle = '#5C9E3A';
        for (let i = 0; i < canvas.width; i += 25) {
            ctx.beginPath();
            ctx.moveTo(i, player.groundY - 5);
            ctx.lineTo(i + 8, player.groundY - 15);
            ctx.lineTo(i - 8, player.groundY - 15);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.strokeStyle = '#FFD966';
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 25]);
        for (let i = 1; i <= 2; i++) {
            const y = player.groundY - 45 * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        state.obstacles.forEach(obs => {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';

            if (obs.type === ObstacleType.JUMP) {
                ctx.fillStyle = '#FF6B6B';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#FF4444';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(obs.x + 5 + i * 10, obs.y);
                    ctx.lineTo(obs.x + 10 + i * 10, obs.y - 8);
                    ctx.lineTo(obs.x + i * 10, obs.y - 8);
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = '#4ECDC4';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = 'rgba(0,0,0,0.12)';
                ctx.fillRect(obs.x + 5, obs.y + obs.height + 8, obs.width - 10, 6);
                ctx.fillStyle = '#3BA89F';
                ctx.fillRect(obs.x + 5, obs.y + 8, obs.width - 10, 4);
                ctx.fillRect(obs.x + 5, obs.y + 18, obs.width - 10, 4);
            }

            const pulse = 0.5 + state.beatIntensity * 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + pulse * 0.4})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x - 2, obs.y - 2, obs.width + 4, obs.height + 4);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obs.type === ObstacleType.JUMP ? '⬆️' : '⬇️', obs.x + obs.width / 2, obs.y + obs.height / 2);
        });

        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.fillStyle = '#FFD966';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        if (player.isSliding) {
            ctx.fillStyle = 'rgba(200,200,200,0.6)';
            ctx.fillRect(player.x - 12, player.y + player.height / 2, 10, 4);
            ctx.fillRect(player.x - 22, player.y + player.height / 2 + 2, 8, 3);
        } else if (player.isJumping) {
            ctx.fillStyle = 'rgba(255,255,200,0.4)';
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.moveTo(player.x - 8 - i * 5, player.y + player.height - 5);
                ctx.lineTo(player.x, player.y + player.height);
                ctx.lineTo(player.x - 5 - i * 5, player.y + player.height + 5);
                ctx.fill();
            }
        }

        ctx.fillStyle = '#2C3E4E';
        ctx.fillRect(player.x + 7, player.y + 10, 5, 5);
        ctx.fillRect(player.x + 17, player.y + 10, 5, 5);

        if (player.isSliding) {
            ctx.fillRect(player.x + 11, player.y + 18, 8, 3);
        } else {
            ctx.beginPath();
            ctx.arc(player.x + 14, player.y + 22, 6, 0, Math.PI);
            ctx.fill();
        }

        ctx.fillStyle = '#FFB7B2';
        ctx.beginPath();
        ctx.arc(player.x + 5, player.y + 20, 3, 0, Math.PI * 2);
        ctx.beginPath();
        ctx.arc(player.x + 24, player.y + 20, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle = '#2C3E4E';
        ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei"';
        ctx.textAlign = 'left';
        ctx.fillText(`🏆 ${score}`, 20, 55);

        if (combo > 1) {
            ctx.fillStyle = combo > 5 ? '#FF6B35' : '#FFD966';
            ctx.font = `bold ${combo > 5 ? 30 : 24}px Arial`;
            ctx.fillText(`${combo} COMBO!`, 20, 110);
        }

        ctx.fillStyle = `rgba(78, 205, 196, ${0.15 + state.beatIntensity * 0.25})`;
        ctx.fillRect(0, 0, canvas.width, 42);

        for (let i = 0; i < 6; i++) {
            const x = 70 + i * 120;
            const scale = 0.7 + state.beatIntensity * 0.5;
            ctx.fillStyle = `rgba(255, 217, 102, ${0.4 + state.beatIntensity * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, 21, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFD966';
            ctx.beginPath();
            ctx.arc(x, 21, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎵 FEEL THE BEAT 🎵', canvas.width / 2, 28);

        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.font = '13px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('← →: 移动  ↑/空格: 跳跃  ↓: 滑铲', canvas.width - 20, canvas.height - 18);

    }, [score, combo]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isGameOver) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 500;
        const groundY = canvas.height - 70;
        gameStateRef.current.player.groundY = groundY;
        gameStateRef.current.player.y = groundY - NORMAL_HEIGHT + 5;

        gameStateRef.current.obstacles = generateMap();

        let animationId: number;

        const gameLoop = () => {
            if (isGameOver) return;
            updateGame();
            draw(ctx, canvas);
            animationId = requestAnimationFrame(gameLoop);
        };

        animationId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationId);
    }, [updateGame, draw, isGameOver, generateMap]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver) return;

            const key = e.key;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(key)) {
                e.preventDefault();
            }

            if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
                gameStateRef.current.keys.left = true;
            }
            if (key === 'ArrowRight' || key === 'd' || key === 'D') {
                gameStateRef.current.keys.right = true;
            }

            if (key === 'ArrowUp' || key === ' ' || key === 'w' || key === 'W') {
                jump();
            }

            if (key === 'ArrowDown' || key === 's' || key === 'S') {
                slide();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key;
            if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
                gameStateRef.current.keys.left = false;
            }
            if (key === 'ArrowRight' || key === 'd' || key === 'D') {
                gameStateRef.current.keys.right = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [jump, slide, isGameOver]);

    const resetGame = useCallback(() => {
        setIsGameOver(false);
        setScore(0);
        setCombo(0);

        const canvas = canvasRef.current;
        const groundY = canvas ? canvas.height - 70 : 350;

        gameStateRef.current = {
            player: {
                x: 200,
                y: groundY - NORMAL_HEIGHT + 5,
                width: PLAYER_WIDTH,
                height: NORMAL_HEIGHT,
                isJumping: false,
                isSliding: false,
                velocityY: 0,
                groundY: groundY,
                normalHeight: NORMAL_HEIGHT,
                slideHeight: SLIDE_HEIGHT,
                direction: 1
            },
            obstacles: [],
            minX: 50,
            maxX: 750,
            frame: 0,
            slideEndTime: 0,
            beatIntensity: 0,
            keys: { left: false, right: false }
        };

        gameStateRef.current.obstacles = generateMap();
    }, [generateMap]);

    return (
        <div className="game-container">
            <canvas ref={canvasRef} className="game-canvas" tabIndex={0} />
            {isGameOver && (
                <div className="game-overlay">
                    <div className="game-over-panel">
                        <h2>🎮 游戏结束 🎮</h2>
                        <p>🏆 最终分数: {score}</p>
                        <button onClick={resetGame} style={{ marginRight: '10px' }}>🔄 再玩一次</button>
                        <button onClick={goToMenu} style={{ backgroundColor: '#4ECDC4' }}>🏠 返回主菜单</button>
                    </div>
                </div>
            )}
            <div className="controls-hint">
                <span>← / A : 向左移动</span>
                <span>→ / D : 向右移动</span>
                <span>↑ / 空格 / W : 跳跃</span>
                <span>↓ / S : 滑铲</span>
                <span>🔴 红色障碍物: 跳跃通过</span>
                <span>🔵 蓝绿色障碍物: 滑铲通过</span>
            </div>
        </div>
    );
};

export default GameCanvas;