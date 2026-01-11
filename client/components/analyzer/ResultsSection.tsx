import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
} from "lucide-react";
import { AnalysisResult } from "@shared/types";

export default function ResultsSection({
  results,
  onReset,
}: {
  results: AnalysisResult;
  onReset: () => void;
}) {
  const hasSignificantContradictions = results.contradictionCount >= 2;

  const downloadResults = () => {
    const text = `CHARACTER ANALYSIS REPORT
========================

Character: ${results.characterName}
Final Decision: ${results.finalDecision === 1 ? "CONSISTENT (1)" : "CONTRADICTORY (0)"}
Contradictions Found: ${results.contradictionCount}

EXPLANATION:
${results.explanation}

DETAILED ANALYSIS:
${results.comparisons
  .map(
    (comp) =>
      `
Claim: "${comp.claim}"
Status: ${comp.supported ? "SUPPORTED" : "CONTRADICTED"}
${comp.contradictions.length > 0 ? `Details: ${comp.contradictions.join(", ")}` : ""}
`
  )
  .join("\n")}

EXTRACTED TRAITS:
${results.extractedTraits
  .map((trait) => `${trait.type}: ${trait.level.toUpperCase()}`)
  .join("\n")}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${results.characterName}-analysis-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Decision Box */}
      <div
        className={`rounded-xl border-2 p-8 text-center ${
          hasSignificantContradictions
            ? "bg-destructive/5 border-destructive/30"
            : "bg-primary/5 border-primary/30"
        }`}
      >
        <div className="flex justify-center mb-4">
          {hasSignificantContradictions ? (
            <AlertCircle className="w-12 h-12 text-destructive" />
          ) : (
            <CheckCircle2 className="w-12 h-12 text-primary" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {hasSignificantContradictions ? "Contradictions Found" : "Character Consistent"}
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          {results.characterName} has{" "}
          <span className="font-bold text-foreground">
            {results.contradictionCount}
          </span>{" "}
          contradiction{results.contradictionCount !== 1 ? "s" : ""}
        </p>
        <div className="inline-block px-4 py-2 rounded-full font-bold text-lg bg-foreground text-background">
          Decision: {results.finalDecision === 1 ? "✓ CONSISTENT (1)" : "✗ CONTRADICTORY (0)"}
        </div>
      </div>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Step 8: Explanation</CardTitle>
          <CardDescription>Analysis summary and findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none space-y-4 text-foreground/90">
            {results.explanation.split("\n").map((line, idx) => (
              <p key={idx} className={line.startsWith("•") ? "ml-4" : ""}>
                {line}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trait Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted Traits (Step 4)</CardTitle>
          <CardDescription>Character trait levels based on observed behavior</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.extractedTraits.map((trait, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-border bg-card space-y-2"
            >
              <div className="font-semibold">{trait.type}</div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  trait.level === "high"
                    ? "bg-accent/20 text-accent"
                    : trait.level === "medium"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {trait.level.charAt(0).toUpperCase() + trait.level.slice(1)}
              </div>
              {trait.evidence.length > 0 && (
                <div className="text-xs space-y-1 mt-2">
                  <p className="font-semibold text-muted-foreground">Evidence:</p>
                  {trait.evidence.map((ev, i) => (
                    <div key={i} className="text-foreground/70 line-clamp-1">
                      • {ev}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comparison Details */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Comparison (Step 6)</CardTitle>
          <CardDescription>Backstory claims vs actual behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.comparisons.map((comp, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                comp.supported
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex gap-3 items-start">
                {comp.supported ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{comp.claim}</p>
                  <p className={`text-xs mt-1 ${
                    comp.supported
                      ? "text-primary"
                      : "text-destructive"
                  }`}>
                    {comp.supported ? "✓ Supported by evidence" : "✗ Contradicted"}
                  </p>
                  {comp.contradictions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {comp.contradictions.map((contra, i) => (
                        <p key={i} className="text-xs text-foreground/70">
                          • {contra}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row justify-between">
        <Button variant="outline" onClick={downloadResults} className="gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Button onClick={onReset} className="gap-2">
            Analyze Another Character
          </Button>
        </div>
      </div>
    </div>
  );
}
