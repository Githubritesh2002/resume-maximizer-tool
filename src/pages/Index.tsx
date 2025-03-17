
import React from 'react';
import { Stepper } from '@progress/kendo-react-layout';
import Header from '../components/Header';
import ResumeUpload from '../components/ResumeUpload';
import TemplateSelector from '../components/TemplateSelector';
import AIEnhancement from '../components/AIEnhancement';
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import { ResumeProvider, useResumeContext } from '../hooks/useResumeContext';
import '@progress/kendo-theme-default/dist/all.css';

const steps = [
  { label: 'Upload Resume', icon: 'upload' },
  { label: 'Choose Template', icon: 'palette' },
  { label: 'AI Enhancement', icon: 'flash' },
  { label: 'Edit Content', icon: 'edit' },
  { label: 'Preview & Export', icon: 'file-pdf' }
];

const StepContent: React.FC = () => {
  const { activeStep, resume } = useResumeContext();
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ResumeUpload />;
      case 1:
        return <TemplateSelector />;
      case 2:
        return <AIEnhancement />;
      case 3:
        return <ResumeEditor />;
      case 4:
        return <ResumePreview />;
      default:
        return <ResumeUpload />;
    }
  };
  
  return renderStepContent();
};

const StepperWrapper: React.FC = () => {
  const { activeStep, setActiveStep, resume } = useResumeContext();
  
  const handleStepChange = (e: any) => {
    // Only allow proceeding to next steps if resume exists (after upload)
    if (e.value > 0 && !resume) {
      return;
    }
    setActiveStep(e.value);
  };
  
  return (
    <div className="mb-10">
      <Stepper
        value={activeStep}
        onChange={handleStepChange}
        items={steps}
        linear={true}
      />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <StepperWrapper />
            <StepContent />
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
};

export default Index;
