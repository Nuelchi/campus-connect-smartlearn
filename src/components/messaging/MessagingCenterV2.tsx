
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Users, Mail } from "lucide-react";
import { useWebSocketMessages } from "@/hooks/useWebSocketMessages";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import UserSearchDialog from "./UserSearchDialog";
import UserSearchByEmail from "./UserSearchByEmail";
import UnreadIndicator from "./UnreadIndicator";

export default function MessagingCenterV2() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    unreadCounts,
    loading,
    sendMessage,
    startConversation,
    refetchConversations
  } = useWebSocketMessages();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [emailSearchOpen, setEmailSearchOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // Check for conversation ID in URL params (when coming from course card)
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      // Find the conversation and set it as active
      const targetConversation = conversations.find(c => c.id === conversationId);
      if (targetConversation) {
        setActiveConversationId(conversationId);
      }
    }
  }, [searchParams, conversations, setActiveConversationId]);

  // Auto-select the most recent conversation if none is selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !activeConversationId) return;

    // Find the recipient from the active conversation
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation || !user) return;

    const recipientId = activeConversation.participant1_id === user.id 
      ? activeConversation.participant2_id 
      : activeConversation.participant1_id;

    try {
      await sendMessage(recipientId, messageContent);
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
    setEmailSearchOpen(false);
  };

  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

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
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Connect with your teachers and students in real-time
            </p>
          </div>
          {totalUnreadCount > 0 && (
            <UnreadIndicator count={totalUnreadCount} className="h-6 w-6" />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setEmailSearchOpen(true)} variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Find by Email
          </Button>
          <Button onClick={() => setSearchOpen(true)} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Start New Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Conversations
              {totalUnreadCount > 0 && (
                <UnreadIndicator count={totalUnreadCount} />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              unreadCounts={unreadCounts}
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

      <UserSearchByEmail
        open={emailSearchOpen}
        onOpenChange={setEmailSearchOpen}
        onSelectUser={handleStartConversation}
      />
    </div>
  );
}
