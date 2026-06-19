export interface MathStep {
  step_number: number;
  description: string;
  latex: string;
  explanation: string;
}

export interface MathSolution {
  problem: string;
  steps: MathStep[];
  final_answer: string;
  latex_answer: string;
  graph_data?: GraphData | null;
}

export interface GraphData {
  expression: string;
  x_min: number;
  x_max: number;
  points: Array<{ x: number; y: number }>;
}

export interface MathSessionState {
  problem: string;
  solution: MathSolution | null;
  isLoading: boolean;
  error: string | null;
  history: MathSolution[];
}
