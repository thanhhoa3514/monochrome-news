import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, BrainCircuit, PenTool, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AiProcessingProps {
    logs: string[];
}

const AiProcessing: React.FC<AiProcessingProps> = ({ logs }) => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { icon: BrainCircuit, label: "Analyzing Request", duration: 1500 },
        { icon: Sparkles, label: "Generating Ideas", duration: 2000 },
        { icon: PenTool, label: "Drafting Content", duration: 3000 },
        { icon: CheckCircle2, label: "Finalizing", duration: 1000 },
    ];

    useEffect(() => {
        // Simulate progress based on steps
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            if (currentProgress > 95) currentProgress = 95; // Hold at 95 until complete
            setProgress(currentProgress);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Determine current step based on logs or time (simplified here to just cycle through)
    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 2000);
        return () => clearInterval(stepInterval);
    }, []);

    const lastLog = logs.length > 0 ? logs[logs.length - 1].replace('> ', '') : 'Initializing...';

    return (
        <Card className="bg-gradient-to-br from-background to-muted/50 border-muted/60 shadow-lg h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

            <div className="z-10 flex flex-col items-center max-w-md w-full space-y-8 p-6">
                {/* Main Icon Animation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <div className="bg-background border-2 border-primary/20 p-6 rounded-full shadow-xl relative">
                        <Sparkles className="w-12 h-12 text-primary animate-spin-slow" />
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold font-serif tracking-tight">Creating Magic</h3>
                    <p className="text-muted-foreground animate-pulse">{lastLog}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Start</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Steps Visualization */}
                <div className="grid grid-cols-4 gap-2 w-full pt-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <div className={`p-2 rounded-full border transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg' :
                                        isCompleted ? 'bg-primary/10 text-primary border-primary/20' :
                                            'bg-muted text-muted-foreground border-transparent'
                                    }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-medium text-center transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default AiProcessing;
