
interface SearchStatusProps {
  loading: boolean;
  notFound: boolean;
  email: string;
}

export default function SearchStatus({ loading, notFound, email }: SearchStatusProps) {
  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Searching for user...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No user found with email "{email}"
      </div>
    );
  }

  return null;
}
