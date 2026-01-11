import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ChevronRight, Home, AlertCircle } from "lucide-react";
import { AnalysisState, BackstoryClaim, TraitLevel, TraitType } from "@shared/types";
import { performCompleteAnalysis, buildTraitsFromActions, extractActionsFromChunk, splitIntoChunks } from "@/lib/analysis";
import ResultsSection from "@/components/analyzer/ResultsSection";
import StepIndicator from "@/components/analyzer/StepIndicator";

const SAMPLE_NOVEL = `Chapter 1: The Beginning

The town was quiet that morning, as if holding its breath. Marcus stood at the edge of the forest, looking back at the only home he had ever known. He had always been told he was different, stronger somehow, more willing to take risks than others. But today, he would discover just how different he truly was.

A scream echoed from the direction of the village. Without thinking, Marcus ran toward the sound. His father had always taught him to be cautious, to follow the rules, to respect authority. But Marcus had never been good at following rules. He had always questioned the elders, always pushed against their boundaries.

The creature was massive, a shadow given form. It had already taken down two villagers. The mayor was shouting orders, but no one was moving. They were frozen with fear. Marcus felt his body moving, felt himself stepping forward. He had never been in a real fight before, never actually hurt anyone. But now, faced with this choice, he felt something ancient awaken inside him.

He struck at the creature, and to his surprise, his blow connected with devastating force. The creature recoiled. Marcus felt no fear, no hesitation. He was filled with a strange clarity, a sense of rightness. This was who he was meant to be.

Chapter 2: Consequences

The village treated Marcus as a hero. But he knew the truth. He had killed that creature not out of nobility, but out of something darker. He had enjoyed the violence. He had felt alive in a way he never had before. The realization terrified him, because it contradicted everything he believed about himself.

His mother had always said he was honest to a fault. She said he couldn't lie, that truth was his greatest virtue. But now he found himself lying to her, to himself. He told everyone the creature was stronger than it was, that he had barely survived the encounter. The truth was far worse: he had crushed it easily, and he had wanted to do it again.

The rule of the village was sacred. Authority flowed from the council, and all must obey. Marcus had grown up accepting this. But after that night, he began to see the council differently. They were not wise guardians, but weak old men who were terrified of the world. He had saved them, and they cowered before him. Why should he obey people he had proven himself superior to?

Chapter 3: Descent

Marcus began to withdraw from the village. He would go to the forest alone, spending hours there. He told people he was clearing the roads of dangers, protecting them. In truth, he was running away, trying to escape what he had become. He hoped that if he could avoid making choices, he could avoid facing the kind of person who had enjoyed killing that creature.

One day, a young woman from the village followed him. Her name was Elena, and she had seen him training with weapons in the forest. She told him she wasn't afraid of him, that she understood him better than anyone else in the village. Marcus wanted to believe her, but he didn't trust his own judgment anymore.

He made a choice that day that would change everything. He told Elena the truth about that night. He told her about the violence, about how he had felt. She listened without judgment, and for a moment, he felt a connection to another person that he had never experienced before. It was terrifying. It made him vulnerable.

But when Elena went back to the village and told others what Marcus had confessed, he felt betrayed. He had been honest, truly honest, and it had cost him everything. The village began to fear him. The council voted to exile him. Marcus realized that his honesty, which he had always believed was his greatest strength, had been his greatest weakness.

As he walked away from the village, Marcus understood something profound. The traits he had been taught to value—honesty, respect for authority, caution—were chains. The thing he had discovered in himself—the capacity for violence, for manipulation, for self-interest—was freedom. Or so he told himself.`;

export default function Analyzer() {
  const [state, setState] = useState<AnalysisState>({
    step: 1,
    chapters: [],
    actions: [],
    traits: [],
    claims: [],
  });

  const [formData, setFormData] = useState({
    novelText: SAMPLE_NOVEL,
    characterName: "Marcus",
    claims: [
      { trait: "Violence", expectedLevel: "low", claim: "Avoids violence" },
      { trait: "Honesty", expectedLevel: "high", claim: "Always tells the truth" },
      { trait: "Risk", expectedLevel: "low", claim: "Cautious and careful" },
      { trait: "Authority", expectedLevel: "high", claim: "Respects authority" },
    ] as Array<{
      trait: TraitType;
      expectedLevel: TraitLevel;
      claim: string;
    }>,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle step transitions
  const handleNextStep = async () => {
    setError(null);

    try {
      if (state.step === 1) {
        // Step 1: Parse novel
        const chapters = splitIntoChunks(formData.novelText);
        setState((prev) => ({
          ...prev,
          step: 2,
          novelText: formData.novelText,
          chapters,
        }));
      } else if (state.step === 2) {
        // Step 2: Store character name
        setState((prev) => ({
          ...prev,
          step: 3,
          characterName: formData.characterName,
        }));
      } else if (state.step === 3) {
        // Step 3: Extract actions
        const actions = state.chapters.flatMap((chunk) =>
          extractActionsFromChunk(chunk.text, chunk.id)
        );
        setState((prev) => ({
          ...prev,
          step: 4,
          actions,
        }));
      } else if (state.step === 4) {
        // Step 4: Build traits
        const traits = buildTraitsFromActions(state.actions);
        setState((prev) => ({
          ...prev,
          step: 5,
          traits,
        }));
      } else if (state.step === 5) {
        // Step 5: Process claims
        const processedClaims: BackstoryClaim[] = formData.claims.map((claim) => ({
          claim: claim.claim,
          trait: claim.trait as TraitType,
          expectedLevel: claim.expectedLevel as TraitLevel,
        }));
        setState((prev) => ({
          ...prev,
          step: 6,
          claims: processedClaims,
        }));
      } else if (state.step === 6) {
        // Skip to step 7 for now (comparison happens internally)
        setState((prev) => ({
          ...prev,
          step: 7,
        }));
      } else if (state.step === 7) {
        // Step 7-8: Perform complete analysis
        setLoading(true);
        const results = await performCompleteAnalysis(
          formData.novelText,
          formData.characterName,
          state.claims
        );
        setState((prev) => ({
          ...prev,
          step: 8,
          results,
        }));
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (state.step > 1) {
      setState((prev) => ({
        ...prev,
        step: prev.step - 1,
      }));
    }
  };

  const handleReset = () => {
    setState({
      step: 1,
      chapters: [],
      actions: [],
      traits: [],
      claims: [],
    });
    setError(null);
  };

  const stepContent = () => {
    switch (state.step) {
      case 1:
        return <Step1NovelInput state={state} formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2CharacterSelect state={state} formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3PreviewChunks state={state} />;
      case 4:
        return <Step4DisplayTraits state={state} />;
      case 5:
        return (
          <Step5DisplayClaims
            state={state}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 6:
        return <Step6Comparison state={state} />;
      case 7:
        return <Step7Analysis />;
      case 8:
        return <Step8Results state={state} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="w-5 h-5" />
            <span className="font-semibold">PlotIQ</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Step {state.step} of 8
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <StepIndicator currentStep={state.step} />

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-8">{stepContent()}</div>

        {/* Navigation Buttons */}
        {state.step < 8 && (
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={state.step === 1}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={loading}
              className="gap-2"
            >
              {loading ? "Processing..." : "Next Step"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= Step Components =============

function Step1NovelInput({ state, formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Store Story (Memory)</CardTitle>
        <CardDescription>
          Upload or paste your novel. It will be automatically split into chapters and chunks
          (500-1000 words each).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Novel Text</label>
          <Textarea
            placeholder="Paste your novel text here..."
            value={formData.novelText}
            onChange={(e) =>
              setFormData({ ...formData, novelText: e.target.value })
            }
            className="min-h-96 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {formData.novelText.split(/\s+/).length} words
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Step2CharacterSelect({ state, formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Find Main Character (Focus)</CardTitle>
        <CardDescription>
          Enter the name of the main character you want to analyze. The system will track all
          events and actions related to this character.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Character Name</label>
          <Input
            placeholder="Enter character name (e.g., Marcus, Elena)"
            value={formData.characterName}
            onChange={(e) =>
              setFormData({ ...formData, characterName: e.target.value })
            }
          />
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            📖 Found {state.chapters.length} chunks from {state.chapters.length > 0 ? state.chapters[state.chapters.length - 1].chapter : 0} chapters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3PreviewChunks({ state }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Extract Actions (Observe)</CardTitle>
        <CardDescription>
          Analyzing chunks for actions, decisions, and emotions...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {state.chapters.slice(0, 5).map((chunk: any) => (
            <div key={chunk.id} className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs font-semibold text-primary">
                  Chapter {chunk.chapter} • Chunk {chunk.order}
                </div>
                <div className="text-xs text-muted-foreground">{chunk.wordCount} words</div>
              </div>
              <p className="text-sm line-clamp-3 text-foreground/80">{chunk.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          ✓ Analyzing {state.chapters.length} chunks for character actions and emotions
        </p>
      </CardContent>
    </Card>
  );
}

function Step4DisplayTraits({ state }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Build Traits (Understand)</CardTitle>
        <CardDescription>
          Extracted traits from character actions and behaviors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {state.traits.map((trait: any, idx: number) => (
            <div key={idx} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">{trait.type}</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    trait.level === "high"
                      ? "bg-accent/20 text-accent"
                      : trait.level === "medium"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {trait.level.charAt(0).toUpperCase() + trait.level.slice(1)}
                </div>
              </div>
              {trait.evidence.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">Evidence:</p>
                  {trait.evidence.map((ev: string, i: number) => (
                    <p key={i} className="text-sm text-foreground/70 line-clamp-1">
                      • {ev}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Step5DisplayClaims({ state, formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Get Backstory Claims (Expect)</CardTitle>
        <CardDescription>
          Define the character's claimed traits from their backstory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {formData.claims.map((claim: any, idx: number) => (
            <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex gap-2 items-center">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {claim.trait}
                </span>
                <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded">
                  Expected: {claim.expectedLevel}
                </span>
              </div>
              <p className="text-sm font-semibold">{claim.claim}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          ℹ️ These claims will be compared against actual character actions in the next steps.
        </div>
      </CardContent>
    </Card>
  );
}

function Step6Comparison({ state }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 6: Compare (Reason)</CardTitle>
        <CardDescription>
          Comparing backstory claims with actual observed behavior...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg space-y-3">
          {state.claims.map((claim: any, idx: number) => (
            <div key={idx} className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{claim.claim}</p>
                <p className="text-xs text-muted-foreground">
                  {claim.trait} ({claim.expectedLevel})
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Step7Analysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 7 & 8: Final Decision & Explanation</CardTitle>
        <CardDescription>
          Analyzing contradictions and generating final report...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-8">
          <div className="text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-muted-foreground">Processing analysis...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step8Results({ state, onReset }: any) {
  if (!state.results) return null;

  return <ResultsSection results={state.results} onReset={onReset} />;
}
