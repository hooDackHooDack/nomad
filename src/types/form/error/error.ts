export interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
}
