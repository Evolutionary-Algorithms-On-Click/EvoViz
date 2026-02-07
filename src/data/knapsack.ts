// Knapsack context onlu for GAs
export interface KnapsackItem {
  id: number;
  weight: number;
  value: number;
  name: string;
}

export const DEFAULT_KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 0, weight: 2, value: 10, name: 'A' },
  { id: 1, weight: 3, value: 15, name: 'B' },
  { id: 2, weight: 1, value: 8,  name: 'C' },
  { id: 3, weight: 4, value: 25, name: 'D' }, 
  { id: 4, weight: 2, value: 12, name: 'E' },
];

export const DEFAULT_CAPACITY = 7;