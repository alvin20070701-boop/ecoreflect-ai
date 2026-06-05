export type Category = 'Clothing' | 'Shoes' | 'Accessories' | 'Bags' | 'Other';

export interface Purchase {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  date: string; // YYYY-MM-DD
}

export interface SustainabilityMetrics {
  score: number;
  grade: 'Excellent' | 'Good' | 'Moderate' | 'Critical';
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    desc: string;
  }[];
  monthlySpend: { [month: string]: number };
  categorySpend: { [category in Category]?: number };
  categoryCount: { [category in Category]?: number };
  purchaseTrend: 'up' | 'down' | 'stable';
}

export interface DuplicateWarning {
  id: string;
  category: Category;
  count: number;
  days: number;
  items: string[];
  warningMessage: string;
}

export interface ReflectionAnalysis {
  summary: string;
  questions: string[];
  suggestions: {
    title: string;
    description: string;
    type: 'reuse' | 'repair' | 'swap' | 'secondhand' | 'creative';
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
