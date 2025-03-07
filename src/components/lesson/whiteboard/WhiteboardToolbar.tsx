import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import {
  Pencil,
  Eraser,
  CircleIcon,
  Square,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Save,
  Check,
  Loader2,
  Image as ImageIcon,
  Wand2,
  Sparkles,
} from 'lucide-react';

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await generateAIDrawing(aiPrompt);
      setAiDialogOpen(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI drawing:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSubmit = () => {
    if (!imageUrl.trim()) return;
    
    handleAddImage(imageUrl);
    setImageDialogOpen(false);
    setImageUrl('');
  };

  return (
    <div className="bg-muted p-2 rounded-md mb-2 flex flex-wrap items-center gap-2">
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
      </div>
      
      {tool === 'text' && (
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text..."
          className="h-8 w-40 ml-2"
        />
      )}
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <div className="flex items-center gap-1">
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Add Image</TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
              <DialogDescription>
                Enter the URL of the image you want to add to the whiteboard.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleImageSubmit}>Add Image</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>AI Drawing</TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Drawing Generator</DialogTitle>
              <DialogDescription>
                Describe what you want to draw, and AI will create it for you.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., Solar system with planets"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAiDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAIGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Drawing
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear Whiteboard</DialogTitle>
              <DialogDescription>
                Are you sure you want to clear the whiteboard? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setClearDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleClear();
                  setClearDialogOpen(false);
                }}
              >
                Clear Whiteboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="h-8 w-8"
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
