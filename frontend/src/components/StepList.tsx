import React from 'react';

interface Step {
  step_number: number;
  title: string;
  description: string;
  action_required?: string;
}

interface StepListProps {
  steps: Step[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => {
  return (
    <div className="flex flex-col gap-6 mt-2">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-6 items-start relative group">
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl border border-white/10 bg-white/5 text-primary flex items-center justify-center font-manrope font-extrabold text-lg group-hover:border-primary transition-all shadow-lg group-hover:shadow-primary/10">
            {step.step_number || idx + 1}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <h4 className="text-white font-manrope font-extrabold text-lg tracking-tight leading-none">{step.title}</h4>
            <p className="text-[14px] leading-relaxed text-muted-foreground font-sans">{step.description}</p>
            
            {step.action_required && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Action: {step.action_required}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
