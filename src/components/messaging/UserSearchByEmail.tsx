
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { useEmailUserSearch } from "@/hooks/useEmailUserSearch";
import EmailSearchInput from "./EmailSearchInput";
import UserSearchResult from "./UserSearchResult";
import SearchStatus from "./SearchStatus";

interface UserSearchByEmailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

export default function UserSearchByEmail({
  open,
  onOpenChange,
  onSelectUser
}: UserSearchByEmailProps) {
  const {
    email,
    setEmail,
    foundUser,
    loading,
    notFound,
    searchUserByEmail,
    resetSearch
  } = useEmailUserSearch();

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      resetSearch();
    }
  }, [open, resetSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Find User by Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <EmailSearchInput
            email={email}
            onEmailChange={setEmail}
            onSearch={searchUserByEmail}
            loading={loading}
          />

          <SearchStatus
            loading={loading}
            notFound={notFound}
            email={email}
          />

          {foundUser && !loading && (
            <UserSearchResult
              user={foundUser}
              onStartConversation={onSelectUser}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
