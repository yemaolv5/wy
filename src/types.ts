export interface DailyContent {
  wisdom: string;
  joke: string;
  healthTip: string;
  foodAdvice: string;
}

export interface PosterData {
  projectName: string;
  reportTitle: string;
  slogan: string;
  dateRange: string;
  mainWork: string[];
  nextWeekPlan: string[];
  contactPhone: string;
  categoryPhotos: Record<string, string[]>;
}

export interface ServiceRecord {
  id: string;
  category: 'security' | 'cleaning' | 'greening' | 'maintenance' | 'customer';
  location: string;
  content: string;
  executor: string;
  imageUrl?: string;
  timestamp: number;
}

export type ReportFrequency = 'daily' | 'weekly' | 'monthly';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'template' | 'law' | 'case';
  category?: string;
}
