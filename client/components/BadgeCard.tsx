import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { BADGES, currentBadge } from "@/types/badge";

const colorClassMap: Record<
  string,
  { bg: string; ring: string; text: string }
> = {
  amber: {
    bg: "bg-amber-500/20",
    ring: "ring-amber-500",
    text: "text-amber-600",
  },
  zinc: { bg: "bg-zinc-500/20", ring: "ring-zinc-500", text: "text-zinc-600" },
  yellow: {
    bg: "bg-yellow-500/20",
    ring: "ring-yellow-500",
    text: "text-yellow-600",
  },
};

export function BadgeCard({
  verifiedDonations,
}: {
  verifiedDonations: number;
}) {
  const badge = currentBadge(verifiedDonations);
  const cls = colorClassMap[badge.color] ?? colorClassMap.amber;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Badge</span>
          <UIBadge className="text-sm" variant="secondary">
            {verifiedDonations} verified
          </UIBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-full ${cls.bg} ring-2 ${cls.ring} flex items-center justify-center ${cls.text} font-bold`}
          >
            {badge.level[0]}
          </div>
          <div>
            <div className="text-xl font-semibold">{badge.level} Badge</div>
            <div className="text-sm text-muted-foreground">
              {badge.discountPercent}% discount at partner hospitals
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.level}
              className={`rounded-md border p-3 ${verifiedDonations >= b.minDonations ? "bg-primary/5 border-primary/40" : "bg-muted/20"}`}
            >
              <div className="text-xs text-muted-foreground">
                {b.minDonations}+ donations
              </div>
              <div className="font-medium">{b.level}</div>
              <div className="text-xs">{b.discountPercent}% off</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
