
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./icons";
import { Circle, Pencil, RectangleHorizontal, Eraser, Hand, ZoomIn, ZoomOut, Type, Undo, Redo, RotateCcw } from "lucide-react";
import { Game } from "@/app/draw/game";

export type Tool = "rectangle" | "circle" | "pencil" | "eraser" | "pan" | "text";

export function Canvas({ RoomId, socket }: { RoomId: number, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rectangle");

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, RoomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }
    }, [canvasRef, RoomId, socket]);

    useEffect(() => {
        if (game) {
            game.setTool(selectedTool);
        }
    }, [game, selectedTool]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                if (game) {
                    game.clearCanvas();
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [game]);

    const handleToolChange = (tool: Tool) => {
        setSelectedTool(tool);
    };

    const handleUndo = () => {
        if (game) game.undo();
    };

    const handleRedo = () => {
        if (game) game.redo();
    };

    const handleZoomIn = () => {
        if (game) game.zoom(1.2);
    };

    const handleZoomOut = () => {
        if (game) game.zoom(0.8);
    };

    const handleResetView = () => {
        if (game) game.resetView();
    };

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0
        }}>
            {/* Toolbar */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "15px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }}
            >
                {/* Drawing Tools */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <IconButton
                        icon={<RectangleHorizontal size={20} />}
                        onClick={() => handleToolChange("rectangle")}
                        activated={selectedTool === "rectangle"}
                    />
                    <IconButton
                        icon={<Circle size={20} />}
                        onClick={() => handleToolChange("circle")}
                        activated={selectedTool === "circle"}
                    />
                    <IconButton
                        icon={<Pencil size={20} />}
                        onClick={() => handleToolChange("pencil")}
                        activated={selectedTool === "pencil"}
                    />
                    <IconButton
                        icon={<Eraser size={20} />}
                        onClick={() => handleToolChange("eraser")}
                        activated={selectedTool === "eraser"}
                    />
                    <IconButton
                        icon={<Type size={20} />}
                        onClick={() => handleToolChange("text")}
                        activated={selectedTool === "text"}
                    />
                    <IconButton
                        icon={<Hand size={20} />}
                        onClick={() => handleToolChange("pan")}
                        activated={selectedTool === "pan"}
                    />
                </div>

                {/* Separator */}
                <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.3)", margin: "6px 0" }} />

                {/* Action Tools */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <IconButton
                        icon={<Undo size={20} />}
                        onClick={handleUndo}
                        activated={false}
                    />
                    <IconButton
                        icon={<Redo size={20} />}
                        onClick={handleRedo}
                        activated={false}
                    />
                    <IconButton
                        icon={<ZoomIn size={20} />}
                        onClick={handleZoomIn}
                        activated={false}
                    />
                    <IconButton
                        icon={<ZoomOut size={20} />}
                        onClick={handleZoomOut}
                        activated={false}
                    />
                    <IconButton
                        icon={<RotateCcw size={20} />}
                        onClick={handleResetView}
                        activated={false}
                    />
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={typeof window !== 'undefined' ? window.innerWidth : 1920}
                height={typeof window !== 'undefined' ? window.innerHeight : 1080}
                style={{
                    display: "block",
                    backgroundColor: "black",
                    width: "100vw",
                    height: "100vh"
                }}
            />
        </div>
    );
}
