import { getExistingShapes } from "./http";
import { Tool } from "@/components/Canvas";
type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: number;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool:Tool;
  private currentPencilPoints: { x: number; y: number }[] = [];
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private isPanning = false;
  private lastPanX = 0;
  private lastPanY = 0;
  private undoStack: Shape[][] = [];
  private redoStack: Shape[][] = [];
  private isTyping = false;
  private textInput: HTMLInputElement | null = null;
  private textX = 0;
  private textY = 0;
  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.selectedTool="rectangle";
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy(){
    this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup",this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove",this.mouseMovehandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler);
    this.removeTextInput();
  }



  setTool(tool:Tool){
    this.selectedTool=tool;
  }

  zoom(factor: number) {
    const newScale = this.scale * factor;
    if (newScale < 0.1 || newScale > 5) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.offsetX = centerX - (centerX - this.offsetX) * factor;
    this.offsetY = centerY - (centerY - this.offsetY) * factor;
    this.scale = newScale;
    
    this.clearCanvas();
  }

  resetView() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.clearCanvas();
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push([...this.existingShapes]);
      this.existingShapes = this.undoStack.pop() || [];
      this.clearCanvas();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push([...this.existingShapes]);
      this.existingShapes = this.redoStack.pop() || [];
      this.clearCanvas();
    }
  }

  private saveState() {
    this.undoStack.push([...this.existingShapes]);
    this.redoStack = []; // Clear redo stack when new action is performed
    
    // Limit undo stack size to prevent memory issues
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    // Update canvas size to match current dimensions
    this.canvas.width = this.canvas.clientWidth || this.canvas.width;
    this.canvas.height = this.canvas.clientHeight || this.canvas.height;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil" && shape.points.length > 1) {
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "text") {
        this.ctx.fillStyle = "white";
        this.ctx.font = `${shape.fontSize}px Arial`;
        this.ctx.fillText(shape.text, shape.x, shape.y);
      }
    });

    this.ctx.restore();
  }

  mouseDownHandler=(e:any)=>{
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;

    if (this.selectedTool === "pan") {
      this.isPanning = true;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      return;
    }

    if (this.selectedTool === "text") {
      this.startTextInput(x, y);
      return;
    }

    this.clicked = true;
    this.startX = x;
    this.startY = y;

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x, y }];
    } else if (this.selectedTool === "eraser") {
      this.saveState();
      this.eraseAt(x, y);
    }
  }

  mouseUpHandler=(e:any)=>{
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }

    this.clicked = false;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;
    
    let shape: Shape | null = null;
    
    if (this.selectedTool === "rectangle") {
      const width = x - this.startX;
      const height = y - this.startY;
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (this.selectedTool === "circle") {
      const width = x - this.startX;
      const height = y - this.startY;
      const radius = Math.sqrt(width * width + height * height) / 2;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: centerX,
        centerY: centerY,
      };
    } else if (this.selectedTool === "pencil" && this.currentPencilPoints.length > 1) {
      shape = {
        type: "pencil",
        points: [...this.currentPencilPoints],
      };
      this.currentPencilPoints = [];
    }
    
    if (!shape) {
      return;
    }
    
    this.saveState();
    this.existingShapes.push(shape);
    console.log("Sending shape:", shape, "to room:", this.roomId);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  }

  mouseMovehandler=(e:any)=>{
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;

    if (this.isPanning) {
      const deltaX = (e.clientX - this.lastPanX) * 0.8; // Reduce panning sensitivity
      const deltaY = (e.clientY - this.lastPanY) * 0.8;
      this.offsetX += deltaX;
      this.offsetY += deltaY;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      this.clearCanvas();
      return;
    }

    if (this.clicked) {
      this.clearCanvas();
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.strokeStyle = "white";

      if (this.selectedTool == "rectangle") {
        const width = x - this.startX;
        const height = y - this.startY;
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool == "circle") {
        const width = x - this.startX;
        const height = y - this.startY;
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = this.startX + width/2;
        const centerY = this.startY + height/2;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === "pencil") {
        this.currentPencilPoints.push({ x, y });
        if (this.currentPencilPoints.length > 1) {
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
          for (let i = 1; i < this.currentPencilPoints.length; i++) {
            this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
          }
          this.ctx.stroke();
          this.ctx.closePath();
        }
      } else if (this.selectedTool === "eraser") {
        this.eraseAt(x, y);
      }
      
      this.ctx.restore();
    }
  }
  
initMouseHandlers() {
    this.canvas.addEventListener("mousedown",this.mouseDownHandler);
    this.canvas.addEventListener("mouseup",this.mouseUpHandler);
    this.canvas.addEventListener("mousemove",this.mouseMovehandler);
    this.canvas.addEventListener("wheel", this.wheelHandler);
}

wheelHandler = (e: WheelEvent) => {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * 0.05); // Reduce zoom sensitivity from 0.1 to 0.05
    const newScale = this.scale * zoom;
    
    // Limit zoom levels
    if (newScale < 0.1 || newScale > 5) return;
    
    // Zoom towards mouse position
    this.offsetX = mouseX - (mouseX - this.offsetX) * zoom;
    this.offsetY = mouseY - (mouseY - this.offsetY) * zoom;
    this.scale = newScale;
    
    this.clearCanvas();
  }

  // Add eraser functionality
  eraseAt(x: number, y: number, radius: number = 20) {
    this.existingShapes = this.existingShapes.filter(shape => {
      if (shape.type === "rect") {
        return !(x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height);
      } else if (shape.type === "circle") {
        const distance = Math.sqrt(
          Math.pow(x - shape.centerX, 2) + Math.pow(y - shape.centerY, 2)
        );
        return distance > shape.radius;
      } else if (shape.type === "pencil") {
        return !shape.points.some(point => {
          const distance = Math.sqrt(
            Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
          );
          return distance <= radius;
        });
      } else if (shape.type === "text") {
        // Approximate text bounds for erasing
        const textWidth = shape.text.length * shape.fontSize * 0.6;
        const textHeight = shape.fontSize;
        return !(x >= shape.x && x <= shape.x + textWidth &&
                y >= shape.y - textHeight && y <= shape.y);
      }
      return true;
    });
    this.clearCanvas();
  }

  startTextInput(x: number, y: number) {
    this.removeTextInput();
    this.textX = x;
    this.textY = y;
    this.isTyping = true;

    // Get canvas position relative to viewport
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = rect.left + (x * this.scale + this.offsetX);
    const canvasY = rect.top + ((y - 16) * this.scale + this.offsetY); // Adjust for text baseline

    // Create text input element - Excalidraw style
    this.textInput = document.createElement('input');
    this.textInput.type = 'text';
    this.textInput.style.position = 'fixed';
    this.textInput.style.left = `${canvasX}px`;
    this.textInput.style.top = `${canvasY}px`;
    this.textInput.style.fontSize = `${Math.max(12, 16 * this.scale)}px`;
    this.textInput.style.fontFamily = 'Arial, sans-serif';
    this.textInput.style.background = 'transparent';
    this.textInput.style.border = 'none';
    this.textInput.style.outline = 'none';
    this.textInput.style.color = 'white';
    this.textInput.style.zIndex = '1000';
    this.textInput.style.padding = '0';
    this.textInput.style.margin = '0';
    this.textInput.style.minWidth = '20px';
    this.textInput.style.resize = 'none';
    this.textInput.style.caretColor = 'white';
    
    // Auto-resize input as user types
    this.textInput.style.width = '20px';
    
    document.body.appendChild(this.textInput);
    
    // Focus with a small delay to ensure it's rendered
    setTimeout(() => {
      this.textInput?.focus();
    }, 10);

    const handleInput = () => {
      if (this.textInput) {
        // Auto-resize the input based on content
        const minWidth = 20;
        const textWidth = this.textInput.value.length * (8 * this.scale) + 10;
        this.textInput.style.width = `${Math.max(minWidth, textWidth)}px`;
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        this.finishTextInput();
      } else if (e.key === 'Escape') {
        this.cancelTextInput();
      }
    };

    const handleBlur = () => {
      // Add a small delay to allow for clicking on other elements
      setTimeout(() => {
        if (this.textInput && document.activeElement !== this.textInput) {
          this.finishTextInput();
        }
      }, 100);
    };

    this.textInput.addEventListener('input', handleInput);
    this.textInput.addEventListener('keydown', handleKeydown);
    this.textInput.addEventListener('blur', handleBlur);
  }

  finishTextInput() {
    if (this.textInput && this.textInput.value.trim()) {
      const textShape: Shape = {
        type: "text",
        x: this.textX,
        y: this.textY,
        text: this.textInput.value,
        fontSize: 16
      };

      this.saveState();
      this.existingShapes.push(textShape);
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape: textShape }),
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    }
    this.removeTextInput();
  }

  cancelTextInput() {
    this.removeTextInput();
  }

  removeTextInput() {
    if (this.textInput) {
      try {
        document.body.removeChild(this.textInput);
      } catch (e) {
        // Element might already be removed
        console.log('Text input already removed');
      }
      this.textInput = null;
    }
    this.isTyping = false;
  }
}