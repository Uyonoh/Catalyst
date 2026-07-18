import re
from typing import Dict, Any, List

class BaseConstraintExtractor:
    def extract(self, input_str: str, current: Dict[str, Any]) -> Dict[str, Any]:
        updates: Dict[str, Any] = {}

        # Tone Detection Patterns
        tone_patterns = {
            "ELI5": [re.compile(r"\bexplain like i'm 5\b", re.IGNORECASE), re.compile(r"\beli5\b", re.IGNORECASE), re.compile(r"\bsimple words\b", re.IGNORECASE)],
            "CREATIVE": [
                re.compile(r"\bfunny\b", re.IGNORECASE),
                re.compile(r"\bcreative\b", re.IGNORECASE),
                re.compile(r"\bwitty\b", re.IGNORECASE),
                re.compile(r"\bhumerous\b", re.IGNORECASE),
                re.compile(r"\bimaginative\b", re.IGNORECASE),
                re.compile(r"\bneon\b", re.IGNORECASE),
                re.compile(r"\bcinematic\b", re.IGNORECASE),
                re.compile(r"\bdrone\b", re.IGNORECASE),
                re.compile(r"\bvibrant\b", re.IGNORECASE),
            ],
            "CONCISE": [
                re.compile(r"\bbrief\b", re.IGNORECASE),
                re.compile(r"\bshort\b", re.IGNORECASE),
                re.compile(r"\bconcise\b", re.IGNORECASE),
                re.compile(r"\btldr\b", re.IGNORECASE),
                re.compile(r"\bsummarize\b", re.IGNORECASE),
            ],
            "PROFESSIONAL": [re.compile(r"\bprofessional\b", re.IGNORECASE), re.compile(r"\bbusiness\b", re.IGNORECASE), re.compile(r"\bformal\b", re.IGNORECASE)],
            "ACADEMIC": [
                re.compile(r"\bacacademic\b", re.IGNORECASE), # Keep same typo from original code if needed, but let's support academic too
                re.compile(r"\bacademics?\b", re.IGNORECASE),
                re.compile(r"\bscholar\b", re.IGNORECASE),
                re.compile(r"\bscientific\b", re.IGNORECASE),
                re.compile(r"\bresearch\b", re.IGNORECASE),
            ],
        }

        # Format Detection Patterns
        format_patterns = {
            "JSON": [re.compile(r"\bjson\b", re.IGNORECASE), re.compile(r"\bjavascript object notation\b", re.IGNORECASE)],
            "CSV": [re.compile(r"\bcsv\b", re.IGNORECASE), re.compile(r"\btable\b", re.IGNORECASE), re.compile(r"\bcomma separated\b", re.IGNORECASE)],
            "YAML": [re.compile(r"\byaml\b", re.IGNORECASE), re.compile(r"\byml\b", re.IGNORECASE)],
            "MARKDOWN": [re.compile(r"\bmarkdown\b", re.IGNORECASE), re.compile(r"\bmd\b", re.IGNORECASE)],
            "PLAIN_TEXT": [re.compile(r"\bplain text\b", re.IGNORECASE), re.compile(r"\btxt\b", re.IGNORECASE)],
        }

        for tone, patterns in tone_patterns.items():
            if any(p.search(input_str) for p in patterns):
                updates["tone"] = tone
                break

        for fmt, patterns in format_patterns.items():
            if any(p.search(input_str) for p in patterns):
                updates["outputFormat"] = fmt
                break

        # Negative Constraints Detection
        # Match matches: e.g. "don't include intro", "without code"
        negatives = []
        negative_matches = re.finditer(
            r"(?:no|without|exclude|don't include)\s+([\w\s]+?)(?=[,.]|$)", input_str, re.IGNORECASE
        )
        for match in negative_matches:
            negatives.append(match.group(1).strip())
            
        if negatives:
            updates["negativeConstraints"] = negatives

        return updates
