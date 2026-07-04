import { PredictionResult } from "./types";

export interface IPredictionHistory {
  add(result: PredictionResult): void;
  getAll(): PredictionResult[];
  getByRecipe(recipeId: string): PredictionResult[];
  clear(): void;
}

export class PredictionHistory implements IPredictionHistory {
  private history: PredictionResult[] = [];

  add(result: PredictionResult): void {
    console.log(`PredictionHistory: Adding prediction result with ID ${result.id}`);
    this.history.push(result);
  }

  getAll(): PredictionResult[] {
    console.log(`PredictionHistory: Retrieving all ${this.history.length} prediction results`);
    return [...this.history];
  }

  getByRecipe(recipeId: string): PredictionResult[] {
    console.log(`PredictionHistory: Retrieving predictions for recipe ${recipeId}`);
    return this.history.filter(result => result.recipeUsed === recipeId);
  }

  clear(): void {
    console.log("PredictionHistory: Clearing all prediction results");
    this.history = [];
  }
}
