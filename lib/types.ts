export type ChallengeStatus = 'Submitted' | 'Validated' | 'Matched' | 'University Accepted' | 'Prototype' | 'Pilot' | 'Implemented';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Challenge = {
  id: string;
  title: string;
  summary: string;
  domain: string;
  subcategory: string;
  district: string;
  location: string;
  lat: number;
  lng: number;
  status: ChallengeStatus;
  priority: Priority;
  impactScore: number;
  affectedPeople: number;
  reports: number;
  verified: boolean;
  submittedBy: string;
  createdAt: string;
  expertise: string[];
  tags: string[];
};

export type Partner = {
  id: string;
  name: string;
  kind: 'University' | 'Industry' | 'Faculty';
  match: number;
  reason: string[];
  capabilities: string[];
};
