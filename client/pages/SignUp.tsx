import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUp() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("role") as "donor" | "hospital") || "donor";

  useEffect(() => {
    if (!params.get("role")) setParams({ role: tab });
  }, []);

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground mt-2">Choose your role and sign up to start donating or managing requests.</p>
        <Tabs className="mt-8" value={tab} onValueChange={(v) => setParams({ role: v })}>
          <TabsList>
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="hospital">Hospital</TabsTrigger>
          </TabsList>
          <TabsContent value="donor" className="mt-6">
            <Card id="donor-signup">
              <CardHeader><CardTitle>Donor Sign Up</CardTitle></CardHeader>
              <CardContent><AuthForm role="donor" mode="signup" /></CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">Already have an account? <Link to="/auth?role=donor" className="text-primary hover:underline">Sign in</Link></p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="hospital" className="mt-6">
            <Card id="hospital-signup">
              <CardHeader><CardTitle>Hospital Sign Up</CardTitle></CardHeader>
              <CardContent><AuthForm role="hospital" mode="signup" /></CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">Already have an account? <Link to="/auth?role=hospital" className="text-primary hover:underline">Sign in</Link></p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
