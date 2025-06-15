
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail } from "lucide-react";

interface EmailSearchInputProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function EmailSearchInput({
  email,
  onEmailChange,
  onSearch,
  loading
}: EmailSearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
          type="email"
        />
      </div>
      <Button onClick={onSearch} disabled={!email.trim() || loading}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
