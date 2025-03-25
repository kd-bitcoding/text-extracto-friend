
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Upload, X } from "lucide-react";

const ImageUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.type.match('image.*')) {
        setSelectedImage(file);
        
        // Create a preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Reset extracted text when new image is selected
        setExtractedText(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.type.match('image.*')) {
        setSelectedImage(file);
        
        // Create a preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Reset extracted text when new image is selected
        setExtractedText(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setExtractedText(null);
  };

  const simulateTextExtraction = async () => {
    if (!selectedImage) return;
    
    setIsUploading(true);
    
    // Simulate API call to upload image and extract text
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted text for demo
      const mockExtractedText = 
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus non dolor pharetra, eu varius erat feugiat. Nulla facilisi. Fusce eu diam felis. Sed sit amet sem at libero aliquet malesuada.";
      
      setExtractedText(mockExtractedText);
      
      toast({
        title: "Text extracted successfully",
        description: "You can now start a chat with the extracted text.",
      });
    } catch (error) {
      toast({
        title: "Text extraction failed",
        description: "There was an error processing your image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const startChat = () => {
    // In a real app, we would save the extracted text and create a new chat stream
    navigate("/chat");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-blur-in">
      <CardHeader>
        <CardTitle>Extract Text from Image</CardTitle>
        <CardDescription>
          Upload an image containing text, and we'll extract it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-secondary/50 transition-colors duration-200"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full bg-primary/10 p-3">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-2 text-sm font-medium">
                Drag and drop an image, or click to browse
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, GIF up to 5MB
              </p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-[400px] object-contain bg-secondary/50"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {extractedText && (
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h3 className="text-sm font-medium mb-2">Extracted Text:</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {extractedText}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={clearImage}
          disabled={!selectedImage || isUploading}
        >
          Clear
        </Button>
        <div className="flex gap-3">
          {selectedImage && !extractedText && (
            <Button 
              onClick={simulateTextExtraction}
              disabled={isUploading}
              className="flex gap-2"
            >
              {isUploading ? "Processing..." : (
                <>
                  <Upload className="h-4 w-4" /> Extract Text
                </>
              )}
            </Button>
          )}
          
          {extractedText && (
            <Button onClick={startChat}>
              Start Chat
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;
