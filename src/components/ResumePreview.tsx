
import React, { useRef } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { useResumeContext } from '../hooks/useResumeContext';
import { DownloadIcon, PrinterIcon, CheckIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumePreview: React.FC = () => {
  const { resume } = useResumeContext();
  const [success, setSuccess] = React.useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  if (!resume) {
    return null;
  }
  
  const handleExportPDF = async () => {
    if (resumeRef.current) {
      try {
        const canvas = await html2canvas(resumeRef.current, { 
          scale: 2,
          useCORS: true,
          logging: false 
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'letter'
        });
        
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${resume.name.replace(/\s+/g, '-').toLowerCase()}-resume.pdf`);
        
        setSuccess("Resume exported as PDF");
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    }
  };
  
  const getTemplateClassName = () => {
    switch (resume.templateId) {
      case 'modern':
        return 'template-modern';
      case 'classic':
        return 'template-classic';
      case 'creative':
        return 'template-creative';
      case 'minimal':
        return 'template-minimal';
      default:
        return 'template-modern';
    }
  };
  
  const renderSectionContent = (section: any) => {
    if (section.type === 'contact') {
      return (
        <div className="contact-info">
          <h1 className="text-3xl font-bold mb-2">{section.content.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {section.content.email && (
              <div>{section.content.email}</div>
            )}
            {section.content.phone && (
              <div>{section.content.phone}</div>
            )}
            {section.content.location && (
              <div>{section.content.location}</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div dangerouslySetInnerHTML={{ __html: section.content.text || '' }} />
    );
  };
  
  return (
    <div className="animate-fade-in-up">
      <div className="bg-card p-5 rounded-xl shadow-sm border border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Resume Preview</h2>
          <div className="flex gap-2">
            <Button
              themeColor="base"
              className="k-button k-button-md k-rounded-md"
              onClick={() => window.print()}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              themeColor="primary"
              className="k-button k-button-md k-rounded-md"
              onClick={handleExportPDF}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 flex justify-center">
          <div 
            ref={resumeRef} 
            className="w-[8.5in] h-[11in] scale-[0.7] origin-top shadow-xl border border-border rounded-lg overflow-hidden"
          >
            <div className={`resume-preview ${getTemplateClassName()} p-8 bg-white h-full`}>
              {resume.sections.map((section) => (
                <div key={section.id} className="mb-6">
                  {section.type !== 'contact' && (
                    <h2 className="text-lg font-semibold border-b pb-1 mb-3">
                      {section.title}
                    </h2>
                  )}
                  {renderSectionContent(section)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-full bg-primary/10">
            <CheckIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">ATS-Friendly Format</h3>
            <p className="text-sm text-muted-foreground">
              Your resume is optimized for Applicant Tracking Systems with a clean layout, 
              proper heading structure, and targeted keywords from the job description.
            </p>
          </div>
        </div>
      </div>
      
      <NotificationGroup
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}
      >
        {success && (
          <Notification
            type={{ style: 'success', icon: true }}
            closable={true}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
};

export default ResumePreview;
