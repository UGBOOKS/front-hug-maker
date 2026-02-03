import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Send, ArrowLeft, BookOpen, MoreVertical } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockConversations, mockMessages } from '@/data/mockBooks';
import { Conversation, Message } from '@/types/book';
import { cn } from '@/lib/utils';

const Messages = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation?.id
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'current-user',
      receiverId: selectedConversation.participantId,
      content: newMessage,
      createdAt: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="container-page py-4 h-[calc(100vh-8rem)]">
        <div className="h-full flex rounded-lg border border-border overflow-hidden bg-card">
          {/* Conversations List */}
          <div
            className={cn(
              'w-full md:w-80 lg:w-96 border-r border-border flex flex-col',
              selectedConversation && 'hidden md:flex'
            )}
          >
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-serif font-bold mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={cn(
                        'w-full p-4 text-left hover:bg-secondary/50 transition-colors',
                        selectedConversation?.id === conversation.id && 'bg-secondary'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                          />
                          <AvatarFallback>
                            {conversation.participantName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate">
                              {conversation.participantName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(conversation.lastMessageAt)}
                            </span>
                          </div>
                          {conversation.bookTitle && (
                            <p className="text-xs text-primary truncate mb-1">
                              Re: {conversation.bookTitle}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              'flex-1 flex flex-col',
              !selectedConversation && 'hidden md:flex'
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConversation.participantAvatar}
                      alt={selectedConversation.participantName}
                    />
                    <AvatarFallback>
                      {selectedConversation.participantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {selectedConversation.participantName}
                    </p>
                    {selectedConversation.bookTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        Discussing: {selectedConversation.bookTitle}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.senderId === 'current-user'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            message.senderId === 'current-user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              'text-xs mt-1',
                              message.senderId === 'current-user'
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            )}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
