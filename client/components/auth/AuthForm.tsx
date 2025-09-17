import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function AuthForm({ role, mode }: { role: "donor" | "hospital"; mode: "login" | "signup" }) {
  const navigate = useNavigate();
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: mode === "login" ? "Signed in" : "Account created", description: `Welcome ${role}!` });
    navigate("/");
  }
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {mode === "signup" && (
        <div>
          <Label htmlFor={`${role}-name`}>Full name</Label>
          <Input id={`${role}-name`} required placeholder="John Doe" />
        </div>
      )}
      <div>
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input id={`${role}-email`} type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input id={`${role}-password`} type="password" required />
      </div>
      {role === "donor" && mode === "signup" && (
        <div>
          <Label htmlFor="blood">Blood Type</Label>
          <Input id="blood" placeholder="O+" required />
        </div>
      )}
      <Button className="w-full" type="submit">{mode === "login" ? "Sign In" : "Create Account"}</Button>
    </form>
  );
}
