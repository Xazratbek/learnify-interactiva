
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface ClearDialogProps {
  handleClear: () => void;
}

const ClearDialog: React.FC<ClearDialogProps> = ({
  handleClear,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClearAndClose = () => {
    handleClear();
    setOpen(false);
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
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleClearAndClose}
          >
            Clear Whiteboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearDialog;
