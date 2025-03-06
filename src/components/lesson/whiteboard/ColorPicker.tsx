
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  color: string;
  brushSize: number;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  brushSize, 
  setColor, 
  setBrushSize 
}) => {
  const predefinedColors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="w-8 h-8 p-0">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-[200px] h-8"
            />
            <div className="flex flex-wrap gap-1">
              {predefinedColors.map((c) => (
                <button
                  key={c}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <div className="w-5 h-5 flex items-end">
              <div className="w-full bg-current rounded-full" style={{ height: `${Math.min(brushSize, 5)}px` }} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Brush size: {brushSize}</p>
            <Slider
              value={[brushSize]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => setBrushSize(value[0])}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
