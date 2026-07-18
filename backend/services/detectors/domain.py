import re
from typing import List, Dict, Tuple, Optional, Any
from services.types import Domain, Intent

class DomainClassifier:
    def __init__(self):
        self.name = "weighted-domain-detector"
        self.patterns: Dict[Domain, List[Tuple[re.Pattern, int]]] = {
            Domain.TECHNICAL_GIS: [
                (re.compile(r"\bgeojson\b", re.IGNORECASE), 3),
                (re.compile(r"\bshapefile\b", re.IGNORECASE), 3),
                (re.compile(r"\bcoordinate\b", re.IGNORECASE), 1),
                (re.compile(r"\bspatial\b", re.IGNORECASE), 1),
                (re.compile(r"\bmap\b", re.IGNORECASE), 1),
                (re.compile(r"\barcgis\b", re.IGNORECASE), 2),
                (re.compile(r"\bqgis\b", re.IGNORECASE), 2),
                (re.compile(r"\blayer\b", re.IGNORECASE), 1),
                (re.compile(r"\bcentroid\b", re.IGNORECASE), 2),
            ],
            Domain.TECHNICAL_BACKEND: [
                (re.compile(r"\bapi\b", re.IGNORECASE), 1),
                (re.compile(r"\bdatabase\b", re.IGNORECASE), 1),
                (re.compile(r"\bendpoint\b", re.IGNORECASE), 2),
                (re.compile(r"\bsql\b", re.IGNORECASE), 1),
                (re.compile(r"\bpostgres\b", re.IGNORECASE), 3),
                (re.compile(r"\bfastapi\b", re.IGNORECASE), 3),
                (re.compile(r"\bdjango\b", re.IGNORECASE), 2),
                (re.compile(r"\bmiddleware\b", re.IGNORECASE), 2),
                (re.compile(r"\basync\b", re.IGNORECASE), 1),
                (re.compile(r"\bredis\b", re.IGNORECASE), 3),
                (re.compile(r"\bwebsockets\b", re.IGNORECASE), 3),
                (re.compile(r"\bnode\b", re.IGNORECASE), 2),
            ],
            Domain.TECHNICAL_FRONTEND: [
                (re.compile(r"\breact\b", re.IGNORECASE), 2),
                (re.compile(r"\btailwind\b", re.IGNORECASE), 3),
                (re.compile(r"\bcss\b", re.IGNORECASE), 1),
                (re.compile(r"\bcomponent\b", re.IGNORECASE), 1),
                (re.compile(r"\bnextjs\b", re.IGNORECASE), 3),
                (re.compile(r"\bhydration\b", re.IGNORECASE), 2),
                (re.compile(r"\bdom\b", re.IGNORECASE), 1),
                (re.compile(r"\bflexbox\b", re.IGNORECASE), 2),
            ],
            Domain.TECHNICAL_DEVOPS: [
                (re.compile(r"\bdocker\b", re.IGNORECASE), 3),
                (re.compile(r"\bkubernetes\b", re.IGNORECASE), 3),
                (re.compile(r"\bci/cd\b", re.IGNORECASE), 2),
                (re.compile(r"\bpipeline\b", re.IGNORECASE), 1),
                (re.compile(r"\baws\b", re.IGNORECASE), 2),
                (re.compile(r"\bterraform\b", re.IGNORECASE), 3),
                (re.compile(r"\bingress\b", re.IGNORECASE), 2),
            ],
            Domain.CREATIVE_MOTION: [
                (re.compile(r"\bframe\b", re.IGNORECASE), 1),
                (re.compile(r"\bfps\b", re.IGNORECASE), 2),
                (re.compile(r"\bcinematic\b", re.IGNORECASE), 2),
                (re.compile(r"\bdrone\b", re.IGNORECASE), 2),
                (re.compile(r"\blighting\b", re.IGNORECASE), 1),
                (re.compile(r"\bshutter\b", re.IGNORECASE), 1),
                (re.compile(r"\bbokeh\b", re.IGNORECASE), 2),
                (re.compile(r"\btracking\b", re.IGNORECASE), 1),
            ],
            Domain.CREATIVE_COPY: [
                (re.compile(r"\bheadline\b", re.IGNORECASE), 2),
                (re.compile(r"\bblog\b", re.IGNORECASE), 1),
                (re.compile(r"\bpersuasive\b", re.IGNORECASE), 2),
                (re.compile(r"\bhook\b", re.IGNORECASE), 2),
                (re.compile(r"\bnarrative\b", re.IGNORECASE), 1),
                (re.compile(r"\btone of voice\b", re.IGNORECASE), 3),
            ],
            Domain.CREATIVE_VISUAL: [
                (re.compile(r"\bcontrast\b", re.IGNORECASE), 1),
                (re.compile(r"\bpalette\b", re.IGNORECASE), 2),
                (re.compile(r"\bcomposition\b", re.IGNORECASE), 1),
                (re.compile(r"\bresolution\b", re.IGNORECASE), 1),
                (re.compile(r"\baspect ratio\b", re.IGNORECASE), 2),
                (re.compile(r"\bnoise\b", re.IGNORECASE), 1),
            ],
            Domain.BUSINESS_STRATEGY: [
                (re.compile(r"\broi\b", re.IGNORECASE), 3),
                (re.compile(r"\bkpi\b", re.IGNORECASE), 3),
                (re.compile(r"\broadmap\b", re.IGNORECASE), 2),
                (re.compile(r"\bstakeholder\b", re.IGNORECASE), 2),
                (re.compile(r"\bcompliance\b", re.IGNORECASE), 2),
                (re.compile(r"\bmarket fit\b", re.IGNORECASE), 3),
            ],
            Domain.GENERAL: [],
        }

    def detect(self, input_str: str) -> List[Dict[str, Any]]:
        results = []
        for domain, wps in self.patterns.items():
            score = 0
            for regex, weight in wps:
                if regex.search(input_str):
                    score += weight
            if score > 0:
                results.append({"value": domain, "score": score})
        # Sort desc
        return sorted(results, key=lambda x: x["score"], reverse=True)
