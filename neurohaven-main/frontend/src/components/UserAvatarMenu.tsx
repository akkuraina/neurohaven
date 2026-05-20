import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

function initialsFrom(name: string, email: string) {
  if (name.trim()) {
    return name
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

export default function UserAvatarMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const initials = useMemo(
    () => (user ? initialsFrom(user.name || "", user.email) : "U"),
    [user]
  );

  const handleSave = () => {
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer hover:opacity-80 transition">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 mr-4">
        <DropdownMenuLabel className="text-lg font-semibold">Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!editing ? (
          <div className="px-3 py-2">
            <p className="font-medium">{name || "Unnamed User"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
            {age && <p className="text-sm text-muted-foreground">Age: {age}</p>}
            <Button className="mt-3 w-full" variant="secondary" onClick={() => setEditing(true)}>
              Edit Info
            </Button>
          </div>
        ) : (
          <div className="px-3 py-2 space-y-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
            />
            <div className="flex gap-2">
              <Button className="w-full" onClick={handleSave}>
                Save
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
