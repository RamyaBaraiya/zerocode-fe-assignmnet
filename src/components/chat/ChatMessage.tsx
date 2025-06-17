
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Copy, Volume2, Heart, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message.",
        variant: "destructive",
      });
    }
  };

  const speakMessage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Speaking...",
        description: "Playing message audio.",
      });
    } else {
      toast({
        title: "Not supported",
        description: "Speech synthesis is not supported in this browser.",
        variant: "destructive",
      });
    }
  };

  const isUser = message.role === 'user';

  if (message.isTyping) {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
            AI
          </AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[80%]">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback className={isUser 
          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs" 
          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs"
        }>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={`group max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 dark:border-gray-600/20">
            <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        {/* Action buttons - only show for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2 text-xs"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={speakMessage}
              className="h-6 px-2 text-xs"
            >
              <Volume2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`h-6 px-2 text-xs ${isLiked ? 'text-blue-500' : ''}`}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLoved(!isLoved)}
              className={`h-6 px-2 text-xs ${isLoved ? 'text-red-500' : ''}`}
            >
              <Heart className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
