
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatExportProps {
  messages: Message[];
}

export const ChatExport: React.FC<ChatExportProps> = ({ messages }) => {
  const { toast } = useToast();

  const exportToJson = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.filter(m => !m.isTyping).length,
      messages: messages
        .filter(m => !m.isTyping)
        .map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported!",
      description: "Your chat history has been downloaded as JSON.",
    });
  };

  const exportToText = () => {
    const textContent = messages
      .filter(m => !m.isTyping)
      .map(m => {
        const timestamp = m.timestamp.toLocaleString();
        const role = m.role === 'user' ? 'You' : 'Assistant';
        return `[${timestamp}] ${role}: ${m.content}`;
      })
      .join('\n\n');

    const header = `Chat Export - ${new Date().toLocaleDateString()}\n${'='.repeat(50)}\n\n`;
    const fullContent = header + textContent;

    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported!",
      description: "Your chat history has been downloaded as text.",
    });
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToText}
        className="text-xs"
      >
        <Download className="w-3 h-3 mr-1" />
        TXT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToJson}
        className="text-xs"
      >
        <Download className="w-3 h-3 mr-1" />
        JSON
      </Button>
    </div>
  );
};
