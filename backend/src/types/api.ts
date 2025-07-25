export interface ApiResponse<T=any> {
    success: boolean;
    message: string | string[];
    data?:T,
    errors?: T;
}


