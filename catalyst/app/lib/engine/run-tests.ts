import { AnalyzerService } from "./AnalyzerService";
import testCases from "./test-cases.json";

const analyzer = new AnalyzerService();

console.log("--- STARTING ANALYZER TESTS ---");

testCases.test_cases.forEach((test, index) => {
  console.log(`\nTest Case #${index + 1}: ${test.input.substring(0, 50)}...`);
  const result = analyzer.analyze(test.input);

  const domainMatch =
    result.detectedDomain === test.expected_metadata.detectedDomain;
  const intentMatch =
    result.primaryIntent === test.expected_metadata.primaryIntent;

  console.log(
    `- Domain: ${result.detectedDomain} (Expected: ${test.expected_metadata.detectedDomain}) [${domainMatch ? "PASS" : "FAIL"}]`,
  );
  console.log(
    `- Intent: ${result.primaryIntent} (Expected: ${test.expected_metadata.primaryIntent}) [${intentMatch ? "PASS" : "FAIL"}]`,
  );
  console.log(`- Confidence: ${result.confidenceScore.toFixed(2)}`);

  if (test.expected_metadata.persona) {
    const personaMatch =
      result.persona?.toLowerCase() ===
      test.expected_metadata.persona.toLowerCase();
    console.log(
      `- Persona: ${result.persona} (Expected: ${test.expected_metadata.persona}) [${personaMatch ? "PASS" : "FAIL"}]`,
    );
  }
  if (test.expected_metadata.style) {
    const styleMatch =
      result.style?.toLowerCase() ===
      test.expected_metadata.style.toLowerCase();
    console.log(
      `- Style: ${result.style} (Expected: ${test.expected_metadata.style}) [${styleMatch ? "PASS" : "FAIL"}]`,
    );
  }
});

console.log("\n--- TESTS COMPLETE ---");
