/**
 * MessagesPage - Web Messaging Interface for Pros/Realtors Portal
 * Displays conversation list and chat interface
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useTavvyChat, Message, Conversation } from '@/hooks/useTavvyChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  User, 
  Clock,
  Loader2,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [, setLocation] = useLocation();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    conversations,
    loading,
    error,
    currentUserId,
    fetchConversations,
    fetchMessages,
    sendMessage
  } = useTavvyChat(activeConversationId || undefined);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !activeConversationId || sending) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      await sendMessage(activeConversationId, text, 'pro');
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessageText(text); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Conversation List View
  if (!activeConversationId) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLocation('/dashboard')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Messages</h1>
              </div>
              <Badge variant="secondary">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </header>

        {/* Conversation List */}
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Inbox className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">
                  When customers contact you about leads, their messages will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <Card 
                  key={conversation.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    conversation.pro_unread_count > 0 && "border-orange-300 bg-orange-50"
                  )}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.customer_name || 'Customer'}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {conversation.last_message_at && formatTime(conversation.last_message_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.project_description || 'No project description'}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conversation.pro_unread_count > 0 && (
                        <Badge className="bg-orange-500 text-white">
                          {conversation.pro_unread_count}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setActiveConversationId(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-medium text-gray-900">
            {activeConversation?.customer_name || 'Customer'}
          </h2>
          {activeConversation?.project_description && (
            <p className="text-sm text-gray-500 truncate">
              {activeConversation.project_description}
            </p>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5",
                      isOwn 
                        ? "bg-orange-500 text-white rounded-br-md" 
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      isOwn ? "text-orange-200" : "text-gray-400"
                    )}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button 
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
