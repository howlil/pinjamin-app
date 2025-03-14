
export type PrismaInclude<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | null;
  };
  
  export type PrismaSelect<T, K extends keyof T> = Pick<T, K>;
  
  export type Nullable<T> = {
    [P in keyof T]?: T[P] | null;
  };
  
  export type WithNullableRelations<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | null;
  };