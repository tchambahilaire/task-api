export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  completed?: boolean;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
}

export interface TaskSort {
  field: 'createdAt' | 'title' | 'updatedAt';
  order: 'asc' | 'desc';
}
