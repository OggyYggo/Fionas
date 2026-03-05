import type { FilterOperator, FilterVariant } from '@/types/data-table';

export const dataTableConfig = {
  columnPinning: {
    left: [],
    right: []
  },
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  rowSelection: {},
  filterVariants: ['text', 'number', 'select', 'date', 'boolean', 'range', 'dateRange', 'multiSelect'] as FilterVariant[],
  operators: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'gt', 'gte', 'lt', 'lte', 'between', 'in', 'notIn', 'isEmpty', 'isNotEmpty'] as FilterOperator[],
  textOperators: [
    { label: 'Equals', value: 'equals' as FilterOperator },
    { label: 'Not Equals', value: 'notEquals' as FilterOperator },
    { label: 'Contains', value: 'contains' as FilterOperator },
    { label: 'Not Contains', value: 'notContains' as FilterOperator },
    { label: 'Starts With', value: 'startsWith' as FilterOperator },
    { label: 'Ends With', value: 'endsWith' as FilterOperator }
  ],
  numericOperators: [
    { label: 'Equals', value: 'equals' as FilterOperator },
    { label: 'Not Equals', value: 'notEquals' as FilterOperator },
    { label: 'Greater Than', value: 'gt' as FilterOperator },
    { label: 'Greater Than or Equal', value: 'gte' as FilterOperator },
    { label: 'Less Than', value: 'lt' as FilterOperator },
    { label: 'Less Than or Equal', value: 'lte' as FilterOperator },
    { label: 'Between', value: 'between' as FilterOperator }
  ],
  dateOperators: [
    { label: 'Equals', value: 'equals' as FilterOperator },
    { label: 'Not Equals', value: 'notEquals' as FilterOperator },
    { label: 'After', value: 'gt' as FilterOperator },
    { label: 'Before', value: 'lt' as FilterOperator },
    { label: 'Between', value: 'between' as FilterOperator }
  ],
  booleanOperators: [
    { label: 'Equals', value: 'equals' as FilterOperator },
    { label: 'Not Equals', value: 'notEquals' as FilterOperator }
  ],
  selectOperators: [
    { label: 'Equals', value: 'equals' as FilterOperator },
    { label: 'Not Equals', value: 'notEquals' as FilterOperator },
    { label: 'In', value: 'in' as FilterOperator },
    { label: 'Not In', value: 'notIn' as FilterOperator }
  ],
  multiSelectOperators: [
    { label: 'In', value: 'in' as FilterOperator },
    { label: 'Not In', value: 'notIn' as FilterOperator }
  ]
};
