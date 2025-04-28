export type BackendResponse<T> = {
  success: boolean;
  data: T;
  error: string;
};
