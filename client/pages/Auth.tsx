import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

function AuthForm({ role, mode }: { role: "donor" | "hospital"; mode: "login" | "signup" }) {
  const navigate = useNavigate();
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: `${mode === "login" ? "Signed in" : "Account created"}`, description: `Welcome ${role}!` });
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

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("role") as "donor" | "hospital") || "donor";

  useEffect(() => {
    if (!params.get("role")) setParams({ role: tab });
  }, []);

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Join Lifeline AI</h1>
        <p className="text-muted-foreground mt-2">Sign up or sign in to start donating or managing hospital requests.</p>
        <Tabs className="mt-8" value={tab} onValueChange={(v) => setParams({ role: v })}>
          <TabsList>
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="hospital">Hospital</TabsTrigger>
          </TabsList>
          <TabsContent value="donor" className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Donor Sign In</CardTitle></CardHeader>
              <CardContent><AuthForm role="donor" mode="login" /></CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card>
              <CardHeader><CardTitle>Donor Sign Up</CardTitle></CardHeader>
              <CardContent><AuthForm role="donor" mode="signup" /></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="hospital" className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Hospital Sign In</CardTitle></CardHeader>
              <CardContent><AuthForm role="hospital" mode="login" /></CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hospital Sign Up</CardTitle></CardHeader>
              <CardContent><AuthForm role="hospital" mode="signup" /></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
