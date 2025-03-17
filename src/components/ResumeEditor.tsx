
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@progress/kendo-react-layout';
import { useResumeContext } from '../hooks/useResumeContext';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Chip } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { Accordion, AccordionItem } from '@progress/kendo-react-layout';

const ResumeEditor: React.FC = () => {
  const { resume, setResume, aiSuggestions } = useResumeContext();
  const [activeSection, setActiveSection] = useState<string | null>(resume?.sections[0]?.id || null);
  const [sectionEditDialogOpen, setSectionEditDialogOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  if (!resume) {
    return null;
  }

  const handleContentChange = (event: any, sectionId: string) => {
    if (!resume) return;
    
    const updatedSections = resume.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content: {
            ...section.content,
            text: event.target.value
          }
        };
      }
      return section;
    });
    
    setResume({
      ...resume,
      sections: updatedSections,
      lastUpdated: new Date()
    });
  };
  
  const handleAddSection = () => {
    setSectionTitle('');
    setSectionEditDialogOpen(true);
  };
  
  const handleSaveSection = () => {
    if (sectionTitle.trim() === '') return;
    
    const newSection: any = {
      id: `section-${Date.now()}`,
      type: 'custom',
      title: sectionTitle,
      content: { text: '' }
    };
    
    setResume({
      ...resume,
      sections: [...resume.sections, newSection],
      lastUpdated: new Date()
    });
    
    setSectionEditDialogOpen(false);
    setActiveSection(newSection.id);
  };
  
  const getContentFromSection = (section: any) => {
    if (section.type === 'contact') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input 
                value={section.content.name || ''} 
                onChange={(e) => {
                  const updatedSections = resume.sections.map(s => {
                    if (s.id === section.id) {
                      return {
                        ...s,
                        content: { ...s.content, name: e.value }
                      };
                    }
                    return s;
                  });
                  setResume({ ...resume, sections: updatedSections, lastUpdated: new Date() });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input 
                type="email"
                value={section.content.email || ''} 
                onChange={(e) => {
                  const updatedSections = resume.sections.map(s => {
                    if (s.id === section.id) {
                      return {
                        ...s,
                        content: { ...s.content, email: e.value }
                      };
                    }
                    return s;
                  });
                  setResume({ ...resume, sections: updatedSections, lastUpdated: new Date() });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input 
                value={section.content.phone || ''} 
                onChange={(e) => {
                  const updatedSections = resume.sections.map(s => {
                    if (s.id === section.id) {
                      return {
                        ...s,
                        content: { ...s.content, phone: e.value }
                      };
                    }
                    return s;
                  });
                  setResume({ ...resume, sections: updatedSections, lastUpdated: new Date() });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input 
                value={section.content.location || ''} 
                onChange={(e) => {
                  const updatedSections = resume.sections.map(s => {
                    if (s.id === section.id) {
                      return {
                        ...s,
                        content: { ...s.content, location: e.value }
                      };
                    }
                    return s;
                  });
                  setResume({ ...resume, sections: updatedSections, lastUpdated: new Date() });
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <textarea
        className="w-full h-64 p-3 border border-border rounded-lg"
        value={section.content.text || ''}
        onChange={(e) => handleContentChange(e, section.id)}
      />
    );
  };
  
  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ minHeight: "600px" }}>
        {/* Left sidebar with sections */}
        <div className="md:col-span-1 bg-card rounded-lg border border-border p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Resume Sections</h3>
            <Button
              themeColor="primary"
              fillMode="flat"
              className="k-button k-button-sm k-rounded-md"
              onClick={handleAddSection}
            >
              Add Section
            </Button>
          </div>
          
          <Accordion>
            {resume.sections.map((section) => (
              <AccordionItem 
                key={section.id}
                title={section.title}
                expanded={activeSection === section.id}
                onAction={() => setActiveSection(section.id)}
              >
                <div className="p-2">
                  <Button
                    themeColor="base"
                    fillMode="flat"
                    className="k-button k-button-sm k-rounded-md w-full text-left"
                    onClick={() => setActiveSection(section.id)}
                  >
                    Edit Content
                  </Button>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
          
          {aiSuggestions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">AI Suggestions</h3>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <ul className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-primary/20 mt-1"></div>
                      <p className="text-sm">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-2 bg-background p-6 rounded-lg border border-border overflow-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {resume.sections.find(s => s.id === activeSection)?.title || 'Select a section'}
              </h2>
              <Chip
                text="ATS-Friendly"
                themeColor="info"
                rounded="full"
                size="small"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Last updated: {resume.lastUpdated.toLocaleString()}
            </p>
          </div>
          
          {activeSection && (
            <div className="bg-card border border-border rounded-lg p-5">
              {getContentFromSection(resume.sections.find(s => s.id === activeSection))}
            </div>
          )}
        </div>
      </div>
      
      {sectionEditDialogOpen && (
        <Dialog title="Add New Section" onClose={() => setSectionEditDialogOpen(false)}>
          <div className="p-4">
            <label className="block text-sm font-medium mb-2">Section Title</label>
            <Input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.value)}
              placeholder="e.g., Skills, Projects, Certifications"
            />
          </div>
          <DialogActionsBar>
            <Button onClick={() => setSectionEditDialogOpen(false)}>Cancel</Button>
            <Button themeColor="primary" onClick={handleSaveSection}>Add Section</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default ResumeEditor;
