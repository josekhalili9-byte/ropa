import { OutfitAnalysis } from "./services/geminiService";

export interface SavedOutfit {
  id: string;
  date: string;
  image: string;
  analysis: OutfitAnalysis;
}
