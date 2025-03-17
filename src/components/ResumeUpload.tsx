import React, { useState } from 'react';
import { Upload } from '@progress/kendo-react-upload';
import { Card } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { FileTextIcon, UploadIcon, FileIcon } from 'lucide-react';
import { useResumeContext } from '../hooks/useResumeContext';
import { parsePdfText, extractResumeData } from '../utils/pdfParser';

const ResumeUpload: React.FC = () => {
  const { 
    setUploadedFile, 
    uploadedFile, 
    setIsProcessing, 
    setResume 
  } = useResumeContext();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpload = (event: any) => {
    if (event.files && event.files.length > 0) {
      const file = event.files[0].getRawFile();
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setUploadedFile(file);
      setSuccess('Resume uploaded successfully');
      
      // Process the PDF
      processPdf(file);
    }
  };

  const processPdf = async (file: File) => {
    try {
      setIsProcessing(true);
      const text = await parsePdfText(file);
      const resumeData = extractResumeData(text);
      
      // Create a new resume object from the extracted data
      setResume({
        id: `resume-${Date.now()}`,
        name: resumeData.contactInfo.name || 'My Resume',
        sections: [
          {
            id: 'contact',
            type: 'contact',
            title: 'Contact Information',
            content: resumeData.contactInfo
          },
          {
            id: 'summary',
            type: 'summary',
            title: 'Professional Summary',
            content: { text: resumeData.summary || '' }
          },
          // Add other sections as needed
        ],
        templateId: 'modern',
        lastUpdated: new Date()
      });
      
      setIsProcessing(false);
      setSuccess('Resume processed successfully');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('Failed to process your resume. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setSuccess(null);
    setError(null);
  };

  const onDismissNotification = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="animate-fade-in-up">
      <Card className="bg-card p-8 rounded-2xl shadow-sm border border-border">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <FileTextIcon className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
          <p className="text-muted-foreground">
            Upload your existing resume in PDF format or create a new one from scratch
          </p>
        </div>

        {!uploadedFile ? (
          <Upload
            batch={false}
            multiple={false}
            restrictions={{
              allowedExtensions: ['.pdf'],
              maxFileSize: 10485760 // 10MB
            }}
            onAdd={handleUpload}
            onRemove={handleClearFile}
            autoUpload={false}
            saveUrl="dummy"
            className="mb-6"
          >
            {/* We need to handle children differently with KendoReact Upload */}
          </Upload>
        ) : (
          <div className="bg-secondary p-6 rounded-lg flex items-center gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{uploadedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              onClick={handleClearFile}
              themeColor="base"
              className="k-button k-button-sm k-rounded-md"
            >
              Remove
            </Button>
          </div>
        )}

        {!uploadedFile && (
          <div className="flex justify-center mt-4 mb-6">
            <Button 
              themeColor="primary"
              className="k-button k-button-md k-rounded-md"
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) {
                  fileInput.click();
                }
              }}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center mt-6">
          <div className="w-full max-w-sm border-t border-border relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-4">
              <span className="text-muted-foreground text-sm">Or</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            themeColor="base"
            className="k-button k-button-md k-rounded-md"
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            Create New Resume
          </Button>
        </div>
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

export default ResumeUpload;
