import React, { useEffect, useRef } from 'react';

interface WhiteboardContainerProps {
  whiteboardData: any;
  onDataUpdate: (newData: any) => void;
  onBackToChat: () => void;
}

const WhiteboardContainer: React.FC<WhiteboardContainerProps> = ({ 
  whiteboardData, 
  onDataUpdate, 
  onBackToChat 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw instructions if they exist
    if (whiteboardData && whiteboardData.length > 0) {
      whiteboardData.forEach((instruction: any) => {
        ctx.beginPath();
        ctx.strokeStyle = instruction.color || '#000000';
        ctx.lineWidth = instruction.width || 2;

        instruction.points.forEach(([x, y]: [number, number], index: number) => {
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Draw label if it exists
        if (instruction.label) {
          ctx.fillStyle = instruction.color || '#000000';
          ctx.font = '14px Arial';
          ctx.fillText(instruction.label, instruction.points[0][0], instruction.points[0][1] - 10);
        }
      });
    }
  }, [whiteboardData]);

  return (
    <div className="whiteboard-container">
      <button 
        onClick={onBackToChat} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Chat
      </button>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-300"
      />
    </div>
  );
};

export default WhiteboardContainer;
