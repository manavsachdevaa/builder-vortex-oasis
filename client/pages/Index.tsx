import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCard } from "@/components/BadgeCard";
import { RequestList } from "@/components/RequestList";
import { toast } from "@/components/ui/use-toast";
import type { BloodRequest, DonorProfile } from "@/lib/ai";
import { mockRequestsNear } from "@/lib/ai";

export default function Index() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [verifiedDonations, setVerifiedDonations] = useState(2);

  const donor: DonorProfile | null = useMemo(() => {
    if (!coords) return null;
    return {
      id: "me",
      name: "You",
      bloodType: "O+",
      lat: coords.lat,
      lng: coords.lng,
      lastDonationDays: 60,
      verifiedDonations,
      reliability: 0.9,
    };
  }, [coords, verifiedDonations]);

  useEffect(() => {
    let timer: any;
    if (coords) {
      const data = mockRequestsNear(coords.lat, coords.lng);
      setRequests(data);
      timer = setInterval(() => {
        const sos = data[Math.floor(Math.random() * data.length)];
        toast({
          title: "SOS: Urgent blood needed",
          description: `${sos.hospital} requests ${sos.units} units of ${sos.bloodType} (${sos.urgency === 3 ? "Critical" : "High"}).`,
        });
      }, 20000);
    }
    return () => clearInterval(timer);
  }, [coords]);

  function enableLocation() {
    if (!navigator.geolocation) {
      toast({ title: "Location not supported", description: "Please allow location or use a supported browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Fallback to a city center coordinate if denied
        setCoords({ lat: 28.6139, lng: 77.209 });// Delhi
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }

  function handleRespond(req: BloodRequest) {
    setVerifiedDonations((d) => d + 1);
    toast({ title: "Thank you!", description: `We notified ${req.hospital}. Your contribution matters.` });
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,hsl(var(--primary)/0.15),transparent),radial-gradient(800px_400px_at_90%_10%,hsl(var(--accent)/0.2),transparent)]" />
        <div className="container py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> AI-powered donor matching
              </div>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Smart blood donor matching and emergency SOS network</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-prose">Lifeline AI connects donors and hospitals in real time using secure AI models for compatibility, reliability and proximity—rewarding every verified donation.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/auth">Get started</Link></Button>
                <Button asChild variant="secondary" size="lg"><a href="#demo">Live demo</a></Button>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary">SOS Alerts</Badge>
                <Badge variant="outline">Rewards</Badge>
                <Badge variant="outline">Secure</Badge>
              </div>
            </div>
            <div className="relative">
              <Card className="shadow-2xl border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Badge</div>
                      <div className="text-2xl font-bold">{verifiedDonations >= 5 ? "Gold" : verifiedDonations >= 3 ? "Silver" : verifiedDonations >= 1 ? "Bronze" : "New"}</div>
                    </div>
                    <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">{verifiedDonations} verified</div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-md bg-primary/10 p-4 text-center">
                      <div className="text-2xl font-bold">50%</div>
                      <div className="text-xs text-muted-foreground">Max discount</div>
                    </div>
                    <div className="rounded-md bg-muted p-4 text-center">
                      <div className="text-2xl font-bold"><span className="text-primary">SOS</span></div>
                      <div className="text-xs text-muted-foreground">Real-time alerts</div>
                    </div>
                    <div className="rounded-md bg-muted p-4 text-center">
                      <div className="text-2xl font-bold">AI</div>
                      <div className="text-xs text-muted-foreground">Smart matching</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon="🤖" title="Smart Matching" desc="Compatibility, proximity and reliability for the best match." />
          <Feature icon="🚨" title="Emergency SOS" desc="Broadcast urgent requests instantly to nearby donors." />
          <Feature icon="🎖️" title="Badges & Rewards" desc="Earn Bronze, Silver or Gold with treatment discounts up to 50%." />
        </div>
      </section>

      <section id="demo" className="bg-muted/30 py-16">
        <div className="container">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Live demo</h2>
              <p className="text-muted-foreground mt-1">Enable location to preview nearby compatible requests and SOS alerts.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={enableLocation}>Enable location</Button>
              <Button variant="secondary" asChild><Link to="/auth">Sign in as donor</Link></Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 space-y-6">
              {donor && (
                <RequestList donor={donor} requests={requests} onRespond={handleRespond} />
              )}
              {!donor && (
                <Card><CardContent className="p-6 text-sm text-muted-foreground">Location is required to compute distance-based matches.</CardContent></Card>
              )}
            </div>
            <div className="md:col-span-2 space-y-6">
              <BadgeCard verifiedDonations={verifiedDonations} />
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Smart donor matching considers blood compatibility, availability windows and donor reliability. Predictive signals estimate high-demand zones from recent requests to pre-warn nearby donors.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Rewards</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Reward tier="Bronze" percent={15} desc="1 verified donation" />
          <Reward tier="Silver" percent={30} desc="3 verified donations" />
          <Reward tier="Gold" percent={50} desc="5+ verified donations" />
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-2xl">{icon}</div>
        <div className="mt-3 font-semibold text-lg">{title}</div>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function Reward({ tier, percent, desc }: { tier: string; percent: number; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg">{tier}</div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{percent}% off</div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{desc} at partner hospitals</p>
      </CardContent>
    </Card>
  );
}
