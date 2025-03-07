
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import DrawingTools from './toolbar/DrawingTools';
import HistoryControls from './toolbar/HistoryControls';
import ActionControls from './toolbar/ActionControls';
import ImageDialog from './toolbar/ImageDialog';
import AIDrawingDialog from './toolbar/AIDrawingDialog';
import ClearDialog from './toolbar/ClearDialog';

interface WhiteboardToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  text: string;
  setText: (text: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  handleDownload: () => void;
  handleSave: () => void;
  saveStatus: string;
  historyIndex: number;
  history: any[];
  imageUrl?: string;
  setImageUrl?: (url: string) => void;
  handleAddImage?: (url: string) => void;
  generateAIDrawing?: (prompt: string) => void;
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  tool,
  setTool,
  text,
  setText,
  handleUndo,
  handleRedo,
  handleClear,
  handleDownload,
  handleSave,
  saveStatus,
  historyIndex,
  history,
  imageUrl = '',
  setImageUrl = () => {},
  handleAddImage = () => {},
  generateAIDrawing = () => {},
}) => {
  return (
    <TooltipProvider>
      <div className="bg-muted p-2 rounded-md mb-2 flex flex-wrap items-center gap-2">
        <DrawingTools
          tool={tool}
          setTool={setTool}
          text={text}
          setText={setText}
        />
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        
        <HistoryControls
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          historyIndex={historyIndex}
          historyLength={history.length}
        />
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        
        <div className="flex items-center gap-1">
          <ImageDialog
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleAddImage={handleAddImage}
          />
          
          <AIDrawingDialog
            generateAIDrawing={generateAIDrawing}
          />
          
          <ClearDialog
            handleClear={handleClear}
          />
          
          <ActionControls
            handleSave={handleSave}
            handleDownload={handleDownload}
            saveStatus={saveStatus}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WhiteboardToolbar;
