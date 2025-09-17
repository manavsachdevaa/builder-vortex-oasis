import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BloodRequest, DonorProfile, matchRequestsForDonor } from "@/lib/ai";

export function RequestList({ donor, requests, onRespond }: { donor: DonorProfile; requests: BloodRequest[]; onRespond: (req: BloodRequest) => void; }) {
  const matches = matchRequestsForDonor(donor, requests);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.length === 0 && (
          <p className="text-sm text-muted-foreground">No compatible requests within 50km.</p>
        )}
        {matches.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{r.hospital}</div>
              <div className="text-sm text-muted-foreground">{r.bloodType} • {r.units} units • {r.distanceKm?.toFixed(1)} km away</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={r.urgency === 3 ? "destructive" : r.urgency === 2 ? "secondary" : "outline"}>
                {r.urgency === 3 ? "Critical" : r.urgency === 2 ? "High" : "Normal"}
              </Badge>
              <Button size="sm" onClick={() => onRespond(r)}>Respond</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
