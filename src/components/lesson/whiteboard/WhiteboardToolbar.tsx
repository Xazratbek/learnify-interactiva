
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Eraser, 
  Circle, 
  Square, 
  Type, 
  Trash2, 
  Undo, 
  Redo, 
  Download, 
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  history: ImageData[];
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
  history
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <ToggleGroup type="single" value={tool} onValueChange={(value) => value && setTool(value)}>
        <ToggleGroupItem value="pencil" aria-label="Pencil tool">
          <Pencil className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="eraser" aria-label="Eraser tool">
          <Eraser className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="circle" aria-label="Circle tool">
          <Circle className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="rectangle" aria-label="Rectangle tool">
          <Square className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="text" aria-label="Text tool">
          <Type className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      
      {tool === 'text' && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-40"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
