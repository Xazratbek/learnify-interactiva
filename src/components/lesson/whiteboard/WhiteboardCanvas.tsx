
import React from 'react';

interface WhiteboardCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  tool: string;
  readOnly: boolean;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  tool,
  readOnly
}) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[500px] touch-none"
        style={{ cursor: readOnly ? 'default' : tool === 'move' ? 'move' : 'crosshair' }}
      />
    </div>
  );
};

export default WhiteboardCanvas;
