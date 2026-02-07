// GP Operations
export type GPOpType = 'ADD_X' | 'ADD_1' | 'SUB_1' | 'SUB_10' | 'MUL_2' | 'DIV_2' | 'SIN' | 'COS' | 'ADD_CONST';

export interface GPOperation {
  id: number;
  type: GPOpType;
  label: string;
  isLocked?: boolean; // For mandatory ops like SIN in Sine mode
}

export const DEFAULT_GP_LINEAR_OPS: GPOperation[] = [
    { id: 0, type: 'ADD_1', label: '+ 1' },
    { id: 1, type: 'SUB_1', label: '- 1' },
    { id: 2, type: 'SUB_10', label: '- 10' },
    { id: 3, type: 'DIV_2', label: '/ 2' }
];

export const DEFAULT_GP_SINE_OPS: GPOperation[] = [
    { id: 0, type: 'ADD_X', label: '+ x' },
    { id: 1, type: 'ADD_1', label: '+ 1' },
    { id: 2, type: 'SIN', label: 'sin(val)', isLocked: true },
    { id: 3, type: 'MUL_2', label: '* 2' }
];