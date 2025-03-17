
import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { FileTextIcon, UploadIcon, DownloadIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">ResumeAI</h1>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Beta</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            themeColor="base"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Resume
          </Button>
          <Button
            themeColor="primary"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
