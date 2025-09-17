import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("role") as "donor" | "hospital") || "donor";

  useEffect(() => {
    if (!params.get("role")) setParams({ role: tab });
  }, []);

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Join Lifeline AI
        </h1>
        <p className="text-muted-foreground mt-2">
          Sign up or sign in to start donating or managing hospital requests.
        </p>
        <Tabs
          className="mt-8"
          value={tab}
          onValueChange={(v) => setParams({ role: v })}
        >
          <TabsList>
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="hospital">Hospital</TabsTrigger>
          </TabsList>
          <TabsContent value="donor" className="mt-6">
            <Card id="donor-login">
              <CardHeader>
                <CardTitle>Donor Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm role="donor" mode="login" />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup?role=donor"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="hospital" className="mt-6">
            <Card id="hospital-login">
              <CardHeader>
                <CardTitle>Hospital Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm role="hospital" mode="login" />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup?role=hospital"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
