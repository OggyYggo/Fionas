import type { Column } from '@tanstack/react-table';

export interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface Range {
  min: number;
  max: number;
}

export interface DataTableFilterField {
  label: string;
  value: string;
  options?: Option[];
}

export type FilterVariant = 'text' | 'number' | 'select' | 'date' | 'boolean' | 'range' | 'dateRange' | 'multiSelect';

export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

export interface ExtendedColumnFilter<TData = unknown> {
  id: string;
  value: unknown;
  operator?: FilterOperator;
  variant?: FilterVariant;
}

export interface ExtendedColumnSort<TData = unknown> {
  id: string;
  desc: boolean;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    range?: Range;
    unit?: string;
    variant?: FilterVariant;
    placeholder?: string;
    label?: string;
    options?: Option[];
  }
}
