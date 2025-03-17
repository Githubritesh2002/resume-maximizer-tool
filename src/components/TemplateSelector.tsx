
import React from 'react';
import { Card, CardBody, CardHeader } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { TileLayout } from '@progress/kendo-react-layout';
import { useResumeContext } from '../hooks/useResumeContext';

const TemplateSelector: React.FC = () => {
  const { templates, resume, setResume } = useResumeContext();

  const handleSelectTemplate = (templateId: string) => {
    if (resume) {
      setResume({
        ...resume,
        templateId,
        lastUpdated: new Date()
      });
    }
  };

  const items = templates.map((template) => ({
    header: template.name,
    body: (
      <div className="flex flex-col items-center">
        <div className="w-full h-40 mb-4 overflow-hidden rounded-lg border border-border">
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x400?text=Template+Preview';
              }}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
        <Button
          themeColor={resume?.templateId === template.id ? "primary" : "base"}
          className="k-button k-button-md k-rounded-md w-full"
          onClick={() => handleSelectTemplate(template.id)}
        >
          {resume?.templateId === template.id ? "Selected" : "Select Template"}
        </Button>
      </div>
    ),
    reorderable: false
  }));

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Select a professional template that best suits your style
        </p>
      </div>

      <TileLayout
        columns={2}
        rowHeight={300}
        gap={{ rows: 20, columns: 20 }}
        items={items}
        className="mb-8"
      />
    </div>
  );
};

export default TemplateSelector;
