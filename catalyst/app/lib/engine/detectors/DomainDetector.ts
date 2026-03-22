import { Domain } from "../types";
import { DomainDetector, DetectionResult, WeightedPattern } from "./types";

export class DomainClassifier implements DomainDetector {
  public name = "weighted-domain-detector";

  private readonly patterns: Record<Domain, WeightedPattern[]> = {
    [Domain.TECHNICAL_GIS]: [
      { regex: /\bgeojson\b/i, weight: 3 },
      { regex: /\bshapefile\b/i, weight: 3 },
      { regex: /\bcoordinate\b/i, weight: 1 },
      { regex: /\bspatial\b/i, weight: 1 },
      { regex: /\bmap\b/i, weight: 1 },
      { regex: /\barcgis\b/i, weight: 2 },
      { regex: /\bqgis\b/i, weight: 2 },
      { regex: /\blayer\b/i, weight: 1 },
      { regex: /\bcentroid\b/i, weight: 2 },
    ],
    [Domain.TECHNICAL_BACKEND]: [
      { regex: /\bapi\b/i, weight: 1 },
      { regex: /\bdatabase\b/i, weight: 1 },
      { regex: /\bendpoint\b/i, weight: 2 },
      { regex: /\bsql\b/i, weight: 1 },
      { regex: /\bpostgres\b/i, weight: 3 },
      { regex: /\bfastapi\b/i, weight: 3 },
      { regex: /\bdjango\b/i, weight: 2 },
      { regex: /\bmiddleware\b/i, weight: 2 },
      { regex: /\basync\b/i, weight: 1 },
      { regex: /\bredis\b/i, weight: 3 },
      { regex: /\bwebsockets\b/i, weight: 3 },
      { regex: /\bnode\b/i, weight: 2 },
    ],
    [Domain.TECHNICAL_FRONTEND]: [
      { regex: /\breact\b/i, weight: 2 },
      { regex: /\btailwind\b/i, weight: 3 },
      { regex: /\bcss\b/i, weight: 1 },
      { regex: /\bcomponent\b/i, weight: 1 },
      { regex: /\bnextjs\b/i, weight: 3 },
      { regex: /\bhydration\b/i, weight: 2 },
      { regex: /\bdom\b/i, weight: 1 },
      { regex: /\bflexbox\b/i, weight: 2 },
    ],
    [Domain.TECHNICAL_DEVOPS]: [
      { regex: /\bdocker\b/i, weight: 3 },
      { regex: /\bkubernetes\b/i, weight: 3 },
      { regex: /\bci\/cd\b/i, weight: 2 },
      { regex: /\bpipeline\b/i, weight: 1 },
      { regex: /\baws\b/i, weight: 2 },
      { regex: /\bterraform\b/i, weight: 3 },
      { regex: /\bingress\b/i, weight: 2 },
    ],
    [Domain.CREATIVE_MOTION]: [
      { regex: /\bframe\b/i, weight: 1 },
      { regex: /\bfps\b/i, weight: 2 },
      { regex: /\bcinematic\b/i, weight: 2 },
      { regex: /\bdrone\b/i, weight: 2 },
      { regex: /\blighting\b/i, weight: 1 },
      { regex: /\bshutter\b/i, weight: 1 },
      { regex: /\bbokeh\b/i, weight: 2 },
      { regex: /\btracking\b/i, weight: 1 },
    ],
    [Domain.CREATIVE_COPY]: [
      { regex: /\bheadline\b/i, weight: 2 },
      { regex: /\bblog\b/i, weight: 1 },
      { regex: /\bpersuasive\b/i, weight: 2 },
      { regex: /\bhook\b/i, weight: 2 },
      { regex: /\bnarrative\b/i, weight: 1 },
      { regex: /\btone of voice\b/i, weight: 3 },
    ],
    [Domain.CREATIVE_VISUAL]: [
      { regex: /\bcontrast\b/i, weight: 1 },
      { regex: /\bpalette\b/i, weight: 2 },
      { regex: /\bcomposition\b/i, weight: 1 },
      { regex: /\bresolution\b/i, weight: 1 },
      { regex: /\baspect ratio\b/i, weight: 2 },
      { regex: /\bnoise\b/i, weight: 1 },
    ],
    [Domain.BUSINESS_STRATEGY]: [
      { regex: /\broi\b/i, weight: 3 },
      { regex: /\bkpi\b/i, weight: 3 },
      { regex: /\broadmap\b/i, weight: 2 },
      { regex: /\bstakeholder\b/i, weight: 2 },
      { regex: /\bcompliance\b/i, weight: 2 },
      { regex: /\bmarket fit\b/i, weight: 3 },
    ],
    [Domain.GENERAL]: [],
  };

  public detect(input: string): DetectionResult<Domain>[] {
    const results: DetectionResult<Domain>[] = [];

    for (const [domain, wp] of Object.entries(this.patterns)) {
      let score = 0;
      for (const pattern of wp) {
        if (pattern.regex.test(input)) {
          score += pattern.weight;
        }
      }

      if (score > 0) {
        results.push({
          value: domain as Domain,
          score: score,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}
