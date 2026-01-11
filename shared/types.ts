export type TraitLevel = "low" | "medium" | "high";

export type TraitType = "Violence" | "Honesty" | "Risk" | "Authority";

export interface StoryChunk {
  id: string;
  chapter: number;
  order: number;
  text: string;
  wordCount: number;
}

export interface ActionData {
  chunkId: string;
  action: string;
  decision: string;
  emotion: string;
}

export interface Trait {
  type: TraitType;
  level: TraitLevel;
  evidence: string[];
}

export interface BackstoryClaim {
  claim: string;
  trait: TraitType;
  expectedLevel: TraitLevel;
}

export interface ComparisonResult {
  claim: string;
  supported: boolean;
  contradictions: string[];
}

export interface AnalysisResult {
  characterName: string;
  backstoryClaims: BackstoryClaim[];
  extractedTraits: Trait[];
  comparisons: ComparisonResult[];
  contradictionCount: number;
  finalDecision: 0 | 1;
  explanation?: string;
}

export interface AnalysisState {
  step: number;
  novelText?: string;
  chapters: StoryChunk[];
  characterName?: string;
  actions: ActionData[];
  traits: Trait[];
  claims: BackstoryClaim[];
  results?: AnalysisResult;
}
