
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Wand2, Loader2, Info } from 'lucide-react';

interface AIDrawingDialogProps {
  generateAIDrawing: (prompt: string, topicContext?: string) => Promise<any>;
  currentTopic?: string;
}

const predefinedDiagrams = [
  { label: "Process Flow", value: "Create a process flow diagram" },
  { label: "Concept Map", value: "Create a concept map" },
  { label: "Timeline", value: "Create a timeline" },
  { label: "Comparison Chart", value: "Create a comparison chart" },
  { label: "Mind Map", value: "Create a mind map" },
  { label: "Hierarchy Diagram", value: "Create a hierarchy diagram" },
  { label: "Cause & Effect", value: "Create a cause and effect diagram" },
  { label: "Venn Diagram", value: "Create a Venn diagram" },
];

const AIDrawingDialog: React.FC<AIDrawingDialogProps> = ({
  generateAIDrawing,
  currentTopic,
}) => {
  const [open, setOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [diagramType, setDiagramType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useTopicContext, setUseTopicContext] = useState(true);

  const handleDiagramTypeChange = (type: string) => {
    setDiagramType(type);
    if (type) {
      const selectedDiagram = predefinedDiagrams.find(d => d.value === type);
      if (selectedDiagram) {
        setAiPrompt(selectedDiagram.value + (aiPrompt ? ` for ${aiPrompt}` : ''));
      }
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const topicContext = useTopicContext && currentTopic ? currentTopic : undefined;
      await generateAIDrawing(aiPrompt, topicContext);
      setOpen(false);
      setAiPrompt('');
      setDiagramType('');
    } catch (error) {
      console.error('Error generating AI drawing:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Drawing Generator</DialogTitle>
          <DialogDescription>
            Describe what you want to visualize, and AI will create a diagram for you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Diagram Type</label>
            <Select value={diagramType} onValueChange={handleDiagramTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a diagram type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Custom (no template)</SelectItem>
                {predefinedDiagrams.map((diagram) => (
                  <SelectItem key={diagram.value} value={diagram.value}>
                    {diagram.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe what to draw</label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., The water cycle showing evaporation, condensation, and precipitation"
              className="h-32 resize-none"
            />
          </div>
          
          {currentTopic && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useTopicContext"
                checked={useTopicContext}
                onChange={(e) => setUseTopicContext(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="useTopicContext" className="text-sm flex items-center">
                Use current topic context: "{currentTopic}"
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The AI will consider the current lesson topic when creating the diagram
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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
  );
};

export default AIDrawingDialog;
