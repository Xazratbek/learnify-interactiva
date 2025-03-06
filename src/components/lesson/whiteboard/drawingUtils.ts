
export const drawCircle = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  color: string
) => {
  if (!ctx) return;
  
  const currentColor = ctx.strokeStyle;
  ctx.strokeStyle = color;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.stroke();
  
  // Restore color
  ctx.strokeStyle = currentColor;
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  color: string
) => {
  if (!ctx) return;
  
  const currentColor = ctx.strokeStyle;
  ctx.strokeStyle = color;
  
  ctx.beginPath();
  ctx.rect(x - width/2, y - height/2, width, height);
  ctx.stroke();
  
  // Restore color
  ctx.strokeStyle = currentColor;
};

export const drawText = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  text: string, 
  color: string,
  brushSize: number
) => {
  if (!ctx) return;
  
  const currentColor = ctx.fillStyle;
  const fontSize = brushSize * 5;
  
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  
  // Restore color
  ctx.fillStyle = currentColor;
};

export const drawLine = (
  ctx: CanvasRenderingContext2D, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  color: string
) => {
  if (!ctx) return;
  
  const currentColor = ctx.strokeStyle;
  ctx.strokeStyle = color;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  // Restore color
  ctx.strokeStyle = currentColor;
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  color: string
) => {
  if (!ctx) return;
  
  const currentColor = ctx.strokeStyle;
  ctx.strokeStyle = color;
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  // Calculate arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 15;
  
  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI/6),
    y2 - headLength * Math.sin(angle - Math.PI/6)
  );
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI/6),
    y2 - headLength * Math.sin(angle + Math.PI/6)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  
  // Restore colors
  ctx.strokeStyle = currentColor;
};
