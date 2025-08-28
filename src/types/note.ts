export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'beobachtung' | 'problem' | 'erfolg';
  timestamp: Date;
  plantId?: string;
  plantName?: string;
  strainId?: string;
  strainName?: string;
  tags: string[];
  isVoiceNote?: boolean;
}

export interface NoteFormData {
  title: string;
  content: string;
  category: 'beobachtung' | 'problem' | 'erfolg';
  plantId?: string;
  plantName?: string;
  strainId?: string;
  strainName?: string;
  tags: string[];
}
