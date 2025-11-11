export interface Entity {
  id: string
  name: string
  type: 'person' | 'organization' | 'project' | 'location'
  twitter?: string
  description?: string
}

export interface EventLink {
  label?: string
  url: string
  type?: "source" | "project" | "article" | "twitter" | "other"
}

export interface Event {
  id: string
  date: string
  year: number
  month?: number
  title: string
  description: string
  entities: string[]
  tags: string[]
  importance: 'low' | 'medium' | 'high'
  links?: EventLink[]
  sources?: EventLink[]
}

export interface YearGroup {
  year: number
  events: Event[]
}

export type TimelineEvent = Event
export type TimelineYear = YearGroup

export interface ProgressState {
  readEvents: string[]
  savedEvents: string[]
  lastReadEventId?: string
  lastReadYear?: number
  scrollPosition?: number
}

export type Theme = 
  | 'defi'
  | 'nfts'
  | 'security'
  | 'governance'
  | 'infrastructure'
  | 'education'
  | 'regulation'
  | 'community'
