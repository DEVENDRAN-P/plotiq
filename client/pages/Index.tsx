import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Book,
  Search,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

export default function Index() {
  const steps = [
    {
      number: 1,
      title: "Store Story",
      description: "Load your novel and split it into meaningful chunks (500-1000 words each)",
      icon: Book,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: 2,
      title: "Find Main Character",
      description: "Identify the protagonist and extract their personal story arc",
      icon: Target,
      color: "from-purple-500 to-purple-600",
    },
    {
      number: 3,
      title: "Extract Actions",
      description: "Find actions, decisions, and emotions from each story chunk",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
    },
    {
      number: 4,
      title: "Build Traits",
      description: "Group actions into traits: Violence, Honesty, Risk, Authority (low/medium/high)",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
    },
    {
      number: 5,
      title: "Get Backstory Claims",
      description: 'Extract expected traits from backstory (e.g., "avoids violence")',
      icon: Search,
      color: "from-pink-500 to-pink-600",
    },
    {
      number: 6,
      title: "Compare",
      description: "Check each claim against real actions: Supported or Contradicted",
      icon: CheckCircle2,
      color: "from-red-500 to-red-600",
    },
    {
      number: 7,
      title: "Final Decision",
      description: "Output: 0 if 2+ contradictions found, else 1",
      icon: Lightbulb,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      number: 8,
      title: "Explain",
      description: "Show contradictions with proof from character's actual actions",
      icon: Book,
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Book className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">PlotIQ</span>
          </div>
          <Link to="/analyzer">
            <Button className="gap-2">
              Start Analyzing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Analyze Character
            <br />
            <span className="gradient-text">Contradictions</span> in Literature
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover inconsistencies between what characters claim about themselves and how they actually behave. A sophisticated tool for literary analysis and character development.
          </p>
          <Link to="/analyzer">
            <Button size="lg" className="gap-2 text-lg px-8">
              Begin Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">8-Step Framework</h3>
            <p className="text-muted-foreground">
              Systematically extract and analyze character traits using a proven methodology.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Detailed Insights</h3>
            <p className="text-muted-foreground">
              Get actionable reports showing trait analysis, contradictions, and supporting evidence.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Intelligent Analysis</h3>
            <p className="text-muted-foreground">
              AI-powered extraction and comparison of character traits across your novel.
            </p>
          </div>
        </div>

        {/* How It Works - Steps */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Our 8-step process breaks down character analysis into manageable, systematic phases
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-1">Step {step.number}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Characters?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Upload a novel and let our intelligent system reveal character contradictions and inconsistencies.
          </p>
          <Link to="/analyzer">
            <Button size="lg" className="gap-2 text-lg">
              Start Analyzing Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>PlotIQ © 2024. Advanced Literary Analysis Tool.</p>
        </div>
      </footer>
    </div>
  );
}
