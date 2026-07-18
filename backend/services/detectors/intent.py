import re
from typing import List, Dict, Tuple, Any
from services.types import Intent

class IntentClassifier:
    def __init__(self):
        self.name = "weighted-intent-detector"
        self.patterns: Dict[Intent, List[Tuple[re.Pattern, int]]] = {
            Intent.DEBUG: [
                (re.compile(r"\berror\b", re.IGNORECASE), 1),
                (re.compile(r"\bfix\b", re.IGNORECASE), 2),
                (re.compile(r"\bbroken\b", re.IGNORECASE), 1),
                (re.compile(r"\bwhy\b", re.IGNORECASE), 1),
                (re.compile(r"\bbug\b", re.IGNORECASE), 3),
                (re.compile(r"\bcrash\b", re.IGNORECASE), 2),
                (re.compile(r"\bissue\b", re.IGNORECASE), 1),
                (re.compile(r"\bfails\b", re.IGNORECASE), 1),
                (re.compile(r"\brendering\b", re.IGNORECASE), 2),
                (re.compile(r"\bnot working\b", re.IGNORECASE), 2),
                (re.compile(r"\blayer\b", re.IGNORECASE), 1),
            ],
            Intent.REFACTOR: [
                (re.compile(r"\boptimize\b", re.IGNORECASE), 2),
                (re.compile(r"\bclean\b", re.IGNORECASE), 1),
                (re.compile(r"\bshorter\b", re.IGNORECASE), 1),
                (re.compile(r"\bimprove\b", re.IGNORECASE), 1),
                (re.compile(r"\bfaster\b", re.IGNORECASE), 2),
                (re.compile(r"\breadable\b", re.IGNORECASE), 2),
            ],
            Intent.SPATIAL_ANALYSIS: [
                (re.compile(r"\bintersect\b", re.IGNORECASE), 3),
                (re.compile(r"\bwithin\b", re.IGNORECASE), 2),
                (re.compile(r"\bdistance\b", re.IGNORECASE), 2),
                (re.compile(r"\bbuffer\b", re.IGNORECASE), 3),
                (re.compile(r"\bheatmap\b", re.IGNORECASE), 3),
            ],
            Intent.STORYBOARD: [
                (re.compile(r"\bscene\b", re.IGNORECASE), 1),
                (re.compile(r"\bsequence\b", re.IGNORECASE), 2),
                (re.compile(r"\bpanel\b", re.IGNORECASE), 2),
            ],
            Intent.BRAINSTORM: [
                (re.compile(r"\bideas\b", re.IGNORECASE), 2),
                (re.compile(r"\bsuggest\b", re.IGNORECASE), 2),
                (re.compile(r"\blist\b", re.IGNORECASE), 1),
                (re.compile(r"\boptions\b", re.IGNORECASE), 1),
                (re.compile(r"\bgive me 10\b", re.IGNORECASE), 3),
                (re.compile(r"\bconcepts\b", re.IGNORECASE), 2),
                (re.compile(r"\bbrainstorm\b", re.IGNORECASE), 3),
            ],
            Intent.SUMMARIZE: [
                (re.compile(r"\btldr\b", re.IGNORECASE), 3),
                (re.compile(r"\bshorten\b", re.IGNORECASE), 1),
                (re.compile(r"\bgist\b", re.IGNORECASE), 2),
                (re.compile(r"\bkey points\b", re.IGNORECASE), 2),
                (re.compile(r"\bbrief\b", re.IGNORECASE), 1),
            ],
            Intent.ARCHITECT: [
                (re.compile(r"\barchitecture\b", re.IGNORECASE), 3),
                (re.compile(r"\bdesign\b", re.IGNORECASE), 1),
                (re.compile(r"\bsystem\b", re.IGNORECASE), 2),
                (re.compile(r"\bstructure\b", re.IGNORECASE), 1),
                (re.compile(r"\bblueprint\b", re.IGNORECASE), 3),
                (re.compile(r"\bmigrate\b", re.IGNORECASE), 2),
                (re.compile(r"\bplan\b", re.IGNORECASE), 1),
            ],
            Intent.DOCUMENT: [
                (re.compile(r"\bdocument\b", re.IGNORECASE), 2),
                (re.compile(r"\bdocumentation\b", re.IGNORECASE), 3),
                (re.compile(r"\bspecs\b", re.IGNORECASE), 2),
                (re.compile(r"\brequirements\b", re.IGNORECASE), 2),
            ],
            Intent.COLOR_GRADE: [
                (re.compile(r"\bcolor\b", re.IGNORECASE), 1),
                (re.compile(r"\bgrade\b", re.IGNORECASE), 2),
                (re.compile(r"\bcolor grading\b", re.IGNORECASE), 3),
                (re.compile(r"\bcolor correction\b", re.IGNORECASE), 3),
            ],
            Intent.COMPOSITION: [
                (re.compile(r"\bcomposition\b", re.IGNORECASE), 3),
                (re.compile(r"\bshot\b", re.IGNORECASE), 2),
                (re.compile(r"\bcinematic\b", re.IGNORECASE), 2),
                (re.compile(r"\blighting\b", re.IGNORECASE), 1),
                (re.compile(r"\bvisualize\b", re.IGNORECASE), 1),
            ],
            Intent.SCRIPTWRITING: [
                (re.compile(r"\bscript\b", re.IGNORECASE), 2),
                (re.compile(r"\bscriptwriting\b", re.IGNORECASE), 3),
            ],
            Intent.STYLE_TRANSFER: [
                (re.compile(r"\bstyle\b", re.IGNORECASE), 1),
                (re.compile(r"\bstyle transfer\b", re.IGNORECASE), 3),
                (re.compile(r"\baesthetic\b", re.IGNORECASE), 2),
                (re.compile(r"\bedit\b", re.IGNORECASE), 2),
                (re.compile(r"\blooks like\b", re.IGNORECASE), 2),
                (re.compile(r"\bcyberpunk\b", re.IGNORECASE), 3),
            ],
            Intent.EXPAND: [
                (re.compile(r"\bexpand\b", re.IGNORECASE), 2)
            ],
            Intent.GENERAL_TASK: [],
        }

    def detect(self, input_str: str) -> List[Dict[str, Any]]:
        results = []
        for intent, wps in self.patterns.items():
            score = 0
            for regex, weight in wps:
                if regex.search(input_str):
                    score += weight
            if score > 0:
                results.append({"value": intent, "score": score})
        return sorted(results, key=lambda x: x["score"], reverse=True)
