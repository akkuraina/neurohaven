import { useState } from "react";
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

export default function UserAvatarMenu() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Akanksha Raina");
  const [email, setEmail] = useState("akanksharainadjsce@gmail.com");
  const [age, setAge] = useState("20");
  const [initials] = useState("AR");

  const handleSave = () => {
    setEditing(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

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
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={() => setEditing(true)}
            >
              Edit Info
            </Button>
          </div>
        ) : (
          <div className="px-3 py-2 space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
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
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setEditing(false)}
              >
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
