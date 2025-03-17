
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { useResumeContext } from '../hooks/useResumeContext';
import { enhanceResumeWithAI } from '../utils/geminiAI';

const AIEnhancement: React.FC = () => {
  const { 
    jobDescription, 
    setJobDescription, 
    resume, 
    setAiSuggestions,
    isProcessing,
    setIsProcessing
  } = useResumeContext();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleGenerateRecommendations = async () => {
    if (!jobDescription) {
      setError('Please enter a job description');
      return;
    }
    
    if (!resume) {
      setError('No resume available for enhancement');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert resume sections to plain text
      const resumeText = resume.sections.map(section => {
        if (section.type === 'contact') {
          const contact = section.content;
          return `${contact.name || ''}\n${contact.email || ''}\n${contact.phone || ''}\n${contact.location || ''}`;
        } else {
          return `${section.title}\n${section.content.text || ''}`;
        }
      }).join('\n\n');
      
      // Get AI suggestions using the Gemini API
      const suggestions = await enhanceResumeWithAI(resumeText, jobDescription);
      
      setAiSuggestions(suggestions);
      setSuccess('AI recommendations generated successfully');
    } catch (err) {
      console.error('Error generating AI recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const onDismissNotification = () => {
    setError(null);
    setSuccess(null);
  };
  
  return (
    <div className="animate-fade-in-up">
      <Card className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border p-6">
          <CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">AI Resume Enhancement</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                Powered by Gemini AI
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Paste the job description below to get AI-powered recommendations for tailoring your resume to the specific role.
            </p>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <TextArea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.value)}
              placeholder="Paste the job description here..."
              className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              themeColor="primary"
              className="k-button k-button-md k-rounded-md"
              disabled={isProcessing || !jobDescription}
              onClick={handleGenerateRecommendations}
            >
              {isProcessing ? (
                <>
                  <Loader size="small" type="pulsing" themeColor="light" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                'Generate Recommendations'
              )}
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <NotificationGroup
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}
      >
        {error && (
          <Notification
            type={{ style: 'error', icon: true }}
            closable={true}
            onClose={onDismissNotification}
          >
            {error}
          </Notification>
        )}
        {success && (
          <Notification
            type={{ style: 'success', icon: true }}
            closable={true}
            onClose={onDismissNotification}
          >
            {success}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
};

export default AIEnhancement;
