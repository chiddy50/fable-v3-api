import { Request } from "express";
export interface IJwtPayload {
  id?: string;
  userId?: string;
  publicId?: string;
  email?: string;
  name: string;
}

export interface CustomRequest extends Request {
  user?: IJwtPayload;
}

export interface User {
  id: string;
  email?: string | null;
  emailVerified?: Date | null;
  name?: string | null;
  publicId?: string | null;
  primaryWalletAddress?: string | null;
  createdAt: Date;
  stories: Story[];
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  genre: string;
  genres: [];
  imageUrl: string;
  type: string;
  slug: string;
  status: string;
  currentStep: Number;
  thematicElements: [];
  thematicOptions: [];
  suspenseTechnique: [];
  suspenseTechniqueDescription: string;
  overview?: string;
  publicId?: string | null;  // Optional unique string
  metaData?: any | null;  // Optional JSON field
  createdAt: Date;
  // plotSuggestions: any
}

export interface Page {
  id: string;
  imageUrl: any; 
  storyId: string;
  content: string;
  number: string;
  createdAt: Date;
  // story: Story
}

export interface Image {
  id: string;
  url: string;
  createdAt: Date;
}

export interface Character {
  id:          string;
  createdAt:   Date;
  storyId:     string;
  imageId:     string;
  name:        string;
  description: string;
  age:         string;
  role:        string;
}

export interface Scene {
  id:          string;
  createdAt:   Date;
  storyId:     string;
  imageId:     string;
  content:     string;
  order:       number;
}