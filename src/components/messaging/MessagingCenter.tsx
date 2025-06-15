
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Users } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import UserSearchDialog from "./UserSearchDialog";

export default function MessagingCenter() {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    loading,
    sendMessage,
    startConversation
  } = useMessages();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !activeConversationId) return;

    // Find the recipient from the active conversation
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation || !user) return;

    const recipientId = activeConversation.participant1_id === user.id 
      ? activeConversation.participant2_id 
      : activeConversation.participant1_id;

    await sendMessage(recipientId, messageContent);
    setMessageContent("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async (userId: string) => {
    const conversationId = await startConversation(userId);
    if (conversationId) {
      setActiveConversationId(conversationId);
    }
    setSearchOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Connect with your teachers and students in real-time
          </p>
        </div>
        <Button onClick={() => setSearchOpen(true)} className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Start New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
            />
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-full flex flex-col">
            {activeConversationId ? (
              <>
                <ChatWindow
                  messages={messages}
                  conversationId={activeConversationId}
                  conversations={conversations}
                />
                
                {/* Message Input */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No conversation selected</p>
                  <p className="text-sm">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UserSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectUser={handleStartConversation}
      />
    </div>
  );
}
