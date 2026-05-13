import React, { useState } from "react";
import GameCanvas from "../rhythm1/GameCanvas";
import "../rhythm1/App.css";

type AppState = "menu" | "game";

export default function Game() {
    const [appState, setAppState] = useState<AppState>("menu");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

    const handleGameEnd = (score: number) => {
        console.log(`游戏结束，得分: ${score}`);
        setAppState("menu");
    };

    const handleStartGame = () => {
        setAppState("game");
    };

    if (appState === "menu") {
        return (
            <div className="app-container">
                <div className="menu-panel">
                    <h1 className="game-title">🎵 节奏跑酷 🏃</h1>
                    <div className="difficulty-selector">
                        <label>选择难度：</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                        >
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                    </div>
                    <button className="start-button" onClick={handleStartGame}>
                        开始游戏
                    </button>
                </div>
            </div>
        );
    }

    return <GameCanvas onGameEnd={handleGameEnd} difficulty={difficulty} />;
}