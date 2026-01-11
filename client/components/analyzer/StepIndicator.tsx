import { CheckCircle2, Circle } from "lucide-react";

const STEPS = [
  "Store Story",
  "Find Character",
  "Extract Actions",
  "Build Traits",
  "Get Claims",
  "Compare",
  "Final Decision",
  "Explain",
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-12">
      <div className="flex justify-between mb-4">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex-1">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary/20 border-2 border-primary text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold text-center hidden sm:inline max-w-20 ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>

              {stepNum < STEPS.length && (
                <div
                  className={`h-1 mt-4 transition-colors ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                  style={{
                    marginLeft: "calc(50% + 20px)",
                    marginRight: "calc(-50% - 20px)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
