
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

interface ImageDialogProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  handleAddImage: (url: string) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  imageUrl,
  setImageUrl,
  handleAddImage,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleImageSubmit = () => {
    if (!imageUrl.trim()) return;
    
    handleAddImage(imageUrl);
    setOpen(false);
    setImageUrl('');
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
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImageSubmit}>Add Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
