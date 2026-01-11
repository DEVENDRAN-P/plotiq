import {
  StoryChunk,
  ActionData,
  Trait,
  TraitLevel,
  TraitType,
  BackstoryClaim,
  ComparisonResult,
  AnalysisResult,
} from "@shared/types";

// Step 1: Split novel into chunks
export function splitIntoChunks(
  text: string,
  minWords: number = 500,
  maxWords: number = 1000
): StoryChunk[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: StoryChunk[] = [];
  let currentChunk = "";
  let currentWordCount = 0;
  let chapter = 1;
  let order = 1;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;
    currentWordCount += words;
    currentChunk += sentence + " ";

    if (currentWordCount >= maxWords) {
      if (currentChunk.trim()) {
        chunks.push({
          id: `chunk-${chapter}-${order}`,
          chapter,
          order,
          text: currentChunk.trim(),
          wordCount: currentWordCount,
        });
        order++;
      }
      currentChunk = "";
      currentWordCount = 0;

      if (order > 5) {
        chapter++;
        order = 1;
      }
    } else if (currentWordCount >= minWords && Math.random() > 0.7) {
      if (currentChunk.trim()) {
        chunks.push({
          id: `chunk-${chapter}-${order}`,
          chapter,
          order,
          text: currentChunk.trim(),
          wordCount: currentWordCount,
        });
        order++;
      }
      currentChunk = "";
      currentWordCount = 0;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      id: `chunk-${chapter}-${order}`,
      chapter,
      order,
      text: currentChunk.trim(),
      wordCount: currentWordCount,
    });
  }

  return chunks;
}

// Step 3: Extract actions from chunk text
export function extractActionsFromChunk(text: string, chunkId: string): ActionData[] {
  const actions: ActionData[] = [];

  const actionPatterns = [
    /(?:he|she|they|the character)\s+(?:decided|chose|decided to|began|started|went|did|made|took)/i,
    /(?:he|she|they)\s+felt?\s+(?:happy|sad|angry|afraid|determined|confused|hopeful)/i,
    /(?:action:|decision:|emotion:)/i,
  ];

  let actionCount = 0;
  for (const pattern of actionPatterns) {
    const matches = text.match(pattern);
    if (matches && actionCount < 3) {
      actions.push({
        chunkId,
        action: matches[0],
        decision: `Decision related to: ${matches[0].substring(0, 30)}...`,
        emotion: "detected",
      });
      actionCount++;
    }
  }

  // If no patterns matched, create a generic extraction
  if (actions.length === 0) {
    const sentences = text.split(".").slice(0, 2);
    actions.push({
      chunkId,
      action: sentences[0]?.trim() || "Action in progress",
      decision: sentences[1]?.trim() || "Pending decision",
      emotion: "implied",
    });
  }

  return actions;
}

// Step 4: Build traits from actions
export function buildTraitsFromActions(actions: ActionData[]): Trait[] {
  const traitTypes: TraitType[] = ["Violence", "Honesty", "Risk", "Authority"];

  return traitTypes.map((traitType) => {
    const relevantActions = actions.filter((action) => {
      const text = `${action.action} ${action.decision}`.toLowerCase();
      const traitKeywords: Record<TraitType, string[]> = {
        Violence: ["fight", "attack", "aggress", "hurt", "harm", "violent"],
        Honesty: ["truth", "honest", "lie", "deceive", "sincere", "transparent"],
        Risk: ["danger", "risky", "bold", "afraid", "cautious", "adventurous"],
        Authority: ["lead", "command", "obey", "rebel", "power", "control"],
      };

      return traitKeywords[traitType].some((keyword) => text.includes(keyword));
    });

    let level: TraitLevel = "low";
    if (relevantActions.length >= 2) level = "medium";
    if (relevantActions.length >= 4) level = "high";

    return {
      type: traitType,
      level,
      evidence: relevantActions.map((a) => a.action).slice(0, 3),
    };
  });
}

// Step 6: Compare claims vs actual traits
export function compareClaimsWithTraits(
  claims: BackstoryClaim[],
  extractedTraits: Trait[]
): ComparisonResult[] {
  return claims.map((claim) => {
    const extractedTrait = extractedTraits.find((t) => t.type === claim.trait);

    if (!extractedTrait) {
      return {
        claim: claim.claim,
        supported: false,
        contradictions: ["No evidence found for trait"],
      };
    }

    // Compare levels
    const claimLevelValue = { low: 1, medium: 2, high: 3 }[claim.expectedLevel];
    const actualLevelValue = { low: 1, medium: 2, high: 3 }[extractedTrait.level];

    const levelDifference = Math.abs(claimLevelValue - actualLevelValue);
    const contradictions: string[] = [];

    if (levelDifference > 1) {
      contradictions.push(
        `Expected ${claim.expectedLevel} but found ${extractedTrait.level}`
      );
    }

    return {
      claim: claim.claim,
      supported: levelDifference <= 1,
      contradictions,
    };
  });
}

// Step 7: Make final decision
export function makeFinalDecision(comparisons: ComparisonResult[]): 0 | 1 {
  const contradictionCount = comparisons.filter((c) => !c.supported).length;
  return contradictionCount >= 2 ? 0 : 1;
}

// Step 8: Generate explanation
export function generateExplanation(
  comparisons: ComparisonResult[],
  extractedTraits: Trait[],
  characterName: string
): string {
  const contradictions = comparisons.filter((c) => !c.supported);

  if (contradictions.length === 0) {
    return `${characterName}'s claims align well with their observed behavior. The character demonstrates consistency between their stated beliefs and actions.`;
  }

  const explanationParts = [
    `${characterName} has ${contradictions.length} contradiction(s) in their character profile:`,
    "",
  ];

  for (const contradiction of contradictions.slice(0, 3)) {
    explanationParts.push(`• Claim: ${contradiction.claim}`);
    if (contradiction.contradictions.length > 0) {
      explanationParts.push(`  Evidence: ${contradiction.contradictions[0]}`);
    }
  }

  return explanationParts.join("\n");
}

// Complete analysis workflow
export async function performCompleteAnalysis(
  novelText: string,
  characterName: string,
  backstoryClaims: BackstoryClaim[]
): Promise<AnalysisResult> {
  // Step 1: Split into chunks
  const chapters = splitIntoChunks(novelText);

  // Step 3: Extract actions
  const allActions = chapters.flatMap((chunk) =>
    extractActionsFromChunk(chunk.text, chunk.id)
  );

  // Step 4: Build traits
  const extractedTraits = buildTraitsFromActions(allActions);

  // Step 6: Compare
  const comparisons = compareClaimsWithTraits(backstoryClaims, extractedTraits);

  // Step 7: Final decision
  const finalDecision = makeFinalDecision(comparisons);

  // Step 8: Explanation
  const explanation = generateExplanation(comparisons, extractedTraits, characterName);

  return {
    characterName,
    backstoryClaims,
    extractedTraits,
    comparisons,
    contradictionCount: comparisons.filter((c) => !c.supported).length,
    finalDecision,
    explanation,
  };
}
