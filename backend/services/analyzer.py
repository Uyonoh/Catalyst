import re
from typing import List, Dict, Any, Optional
from backend.services.types import Domain, Intent
from backend.services.detectors.domain import DomainClassifier
from backend.services.detectors.intent import IntentClassifier
from backend.services.detectors.constraint import BaseConstraintExtractor
from backend.services.detectors.scenario import ScenarioDetector

class AnalyzerService:
    def __init__(self):
        self.domain_classifier = DomainClassifier()
        self.intent_classifier = IntentClassifier()
        self.constraint_extractor = BaseConstraintExtractor()
        self.scenario_detector = ScenarioDetector()

        # Multipliers for "high-intent" verbs
        self.boosters = {
            "write": 1.2,
            "create": 1.2,
            "generate": 1.2,
            "build": 1.3,
            "analyze": 1.4,
            "fix": 1.5,
            "optimize": 1.4,
        }

    def analyze(self, input_str: str, assets: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        if assets is None:
            assets = []
        lower_input = input_str.lower()

        # 1. Detect Domain with Boosters
        domain_results = self.domain_classifier.detect(lower_input)
        domain_results = self._apply_boosters(lower_input, domain_results)
        domain = domain_results[0]["value"] if domain_results else Domain.GENERAL

        # 2. Detect Intents with Boosters
        intent_results = self.intent_classifier.detect(lower_input)
        intent_results = self._apply_boosters(lower_input, intent_results)
        primary_intent = intent_results[0]["value"] if intent_results else Intent.GENERAL_TASK
        secondary_intents = [intent_results[1]["value"]] if len(intent_results) > 1 else []

        # 3. Extract Constraints & Scenarios
        base_constraints = {
            "tone": "PROFESSIONAL",
            "outputFormat": "PLAIN_TEXT",
        }
        constraints = {
            **base_constraints,
            **self.constraint_extractor.extract(lower_input, base_constraints),
        }

        scenario = self.scenario_detector.detect(lower_input)

        # 4. Calculate Confidence Score
        confidence_score = self._calculate_confidence(domain_results, intent_results)

        return {
            "originalInput": input_str,
            "detectedDomain": domain,
            "primaryIntent": primary_intent,
            "secondaryIntents": secondary_intents,
            "confidenceScore": confidence_score,
            "assets": assets,
            "constraints": constraints,
            "variables": self._extract_variables(input_str),
            "persona": scenario.get("persona"),
            "style": scenario.get("style"),
        }

    def _apply_boosters(self, input_str: str, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        boosted = []
        for res in results:
            multiplier = 1.0
            for word, boost in self.boosters.items():
                if word in input_str:
                    multiplier = max(multiplier, boost)
            boosted.append({**res, "score": res["score"] * multiplier})
        return sorted(boosted, key=lambda x: x["score"], reverse=True)

    def _calculate_confidence(self, domain_results: List[Dict[str, Any]], intent_results: List[Dict[str, Any]]) -> float:
        d_score = domain_results[0]["score"] if domain_results else 0.0
        i_score = intent_results[0]["score"] if intent_results else 0.0

        # Penalty for "Conflicts" (if the top 2 matches are too close, confidence drops)
        conflict_penalty = 1.0
        if len(domain_results) > 1:
            gap = domain_results[0]["score"] - domain_results[1]["score"]
            if gap < 2:
                conflict_penalty -= 0.1
        if len(intent_results) > 1:
            gap = intent_results[0]["score"] - intent_results[1]["score"]
            if gap < 2:
                conflict_penalty -= 0.1

        base_confidence = min(0.98, (d_score + i_score) / 10.0)
        return max(0.3, base_confidence * conflict_penalty)

    def _extract_variables(self, input_str: str) -> Dict[str, str]:
        variables = {}
        matches = re.findall(r"{{(.*?)}}", input_str)
        for m in matches:
            variables[m] = ""
        return variables
