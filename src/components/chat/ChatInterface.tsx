
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const mockInitialMessages: Message[] = [
  {
    id: "1",
    content: "I've extracted the text from your image. What would you like to know about it?",
    sender: "ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockInitialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponses = [
        "Based on the extracted text, I can tell you that...",
        "The document you uploaded contains information about...",
        "According to the text, the main points are...",
        "I've analyzed the content and found that...",
        "The text you provided discusses several key topics including...",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] w-full max-w-4xl mx-auto animate-blur-in">
      <CardHeader className="border-b px-6">
        <CardTitle>Text Analysis Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%] rounded-lg p-4",
                message.sender === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-secondary mr-auto"
              )}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1 self-end">
                {new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                }).format(message.timestamp)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-2 p-4 max-w-[80%] bg-secondary rounded-lg mr-auto">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200" />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-500" />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask a question about the text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
