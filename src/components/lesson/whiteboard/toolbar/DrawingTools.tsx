
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Pencil, Eraser, CircleIcon, Square, Type } from 'lucide-react';

interface DrawingToolsProps {
  tool: string;
  setTool: (tool: string) => void;
  text: string;
  setText: (text: string) => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  tool,
  setTool,
  text,
  setText,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('pencil')}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Pencil</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('eraser')}
            className="h-8 w-8"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Eraser</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'circle' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('circle')}
            className="h-8 w-8"
          >
            <CircleIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Circle</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'rectangle' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('rectangle')}
            className="h-8 w-8"
          >
            <Square className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Rectangle</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'text' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('text')}
            className="h-8 w-8"
          >
            <Type className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Text</TooltipContent>
      </Tooltip>
      
      {tool === 'text' && (
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text..."
          className="h-8 w-40 ml-2"
        />
      )}
    </div>
  );
};

export default DrawingTools;
