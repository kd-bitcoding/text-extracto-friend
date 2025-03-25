
// Type definitions for components

declare module "@/components/dashboard/ImageUploader" {
  import { FC } from "react";
  
  export interface ImageUploaderProps {
    onExtractComplete?: (result: {
      imageUrl: string;
      extractedText: string;
      title: string;
    }) => void;
  }
  
  const ImageUploader: FC<ImageUploaderProps>;
  export default ImageUploader;
}

declare module "@/components/chat/ChatInterface" {
  import { FC } from "react";
  import { ChatSession } from "@/services/chatService";
  
  export interface ChatInterfaceProps {
    sessionId?: string | null;
    initialSession?: ChatSession | null;
  }
  
  const ChatInterface: FC<ChatInterfaceProps>;
  export default ChatInterface;
}
