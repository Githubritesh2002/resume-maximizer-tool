
import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc property to a local worker file instead of CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export async function parsePdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Get all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}

export function extractResumeData(text: string) {
  // This is a simplified example - in a real app, you would use more sophisticated
  // NLP or pattern matching to extract structured data from the resume text
  
  // Basic structure for extracted resume data
  const resumeData = {
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  };
  
  // Extract name (assuming it's at the beginning of the resume)
  const nameMatch = text.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m);
  if (nameMatch) {
    resumeData.contactInfo.name = nameMatch[0].trim();
  }
  
  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    resumeData.contactInfo.email = emailMatch[0];
  }
  
  // Extract phone (simplified pattern)
  const phoneMatch = text.match(/\b(\+?1?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4})\b/);
  if (phoneMatch) {
    resumeData.contactInfo.phone = phoneMatch[0];
  }
  
  // Extract summary (assuming it starts with "Summary" or "Profile" and ends with a newline)
  const summaryMatch = text.match(/(?:Summary|Profile|About)(.*?)(?:\n\n)/is);
  if (summaryMatch) {
    resumeData.summary = summaryMatch[1].trim();
  }
  
  // For more complex sections like experience, education, and skills,
  // you would need more sophisticated parsing logic
  
  return resumeData;
}
