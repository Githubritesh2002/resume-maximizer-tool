
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ResumeSection {
  id: string;
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  title: string;
  content: any;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface Resume {
  id: string;
  name: string;
  sections: ResumeSection[];
  templateId: string;
  lastUpdated: Date;
}

interface ResumeContextType {
  resume: Resume | null;
  setResume: (resume: Resume | null) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  templates: ResumeTemplate[];
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  aiSuggestions: string[];
  setAiSuggestions: (suggestions: string[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const defaultTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '/templates/modern.png',
    description: 'Clean and professional layout with a modern touch',
  },
  {
    id: 'classic',
    name: 'Classic',
    thumbnail: '/templates/classic.png',
    description: 'Traditional resume format focused on experience',
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: '/templates/creative.png',
    description: 'Bold design for creative professionals',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: '/templates/minimal.png',
    description: 'Simple and elegant with clean typography',
  },
];

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const value = {
    resume,
    setResume,
    activeStep,
    setActiveStep,
    jobDescription,
    setJobDescription,
    templates: defaultTemplates,
    uploadedFile,
    setUploadedFile,
    isProcessing,
    setIsProcessing,
    aiSuggestions,
    setAiSuggestions,
  };
  
  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};
