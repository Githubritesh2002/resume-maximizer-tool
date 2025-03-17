
import React from 'react';
import { AppBar, AppBarSection, AppBarSpacer } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { FileTextIcon, UploadIcon, DownloadIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <AppBar className="bg-card border-b border-border shadow-sm">
      <AppBarSection>
        <div className="flex items-center gap-2 py-2 px-4">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">ResumeAI</h1>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Beta</span>
        </div>
      </AppBarSection>
      
      <AppBarSpacer />
      
      <AppBarSection>
        <div className="flex items-center gap-3 pr-4">
          <Button
            icon={<UploadIcon className="h-4 w-4" />}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            themeColor="base"
          >
            Upload Resume
          </Button>
          <Button
            icon={<DownloadIcon className="h-4 w-4" />}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            themeColor="primary"
          >
            Download
          </Button>
        </div>
      </AppBarSection>
    </AppBar>
  );
};

export default Header;
