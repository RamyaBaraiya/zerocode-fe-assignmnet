
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [authTab, setAuthTab] = useState('login');

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('chatbot_token');
    const userData = localStorage.getItem('chatbot_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('chatbot_token');
        localStorage.removeItem('chatbot_user');
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('chatbot_token');
    localStorage.removeItem('chatbot_user');
    setUser(null);
  };

  if (user) {
    return <ChatInterface user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ChatBot AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your intelligent conversation partner
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
          <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onLogin={handleLogin} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onRegister={handleLogin} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
