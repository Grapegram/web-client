import * as E from 'fp-ts/Either';
export type Method =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT';

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ApiResponse<T> extends Response {
  readonly data?: T;
}

export interface ApiRequestConfig<D> extends RequestInit {
  awaitData?: boolean;
  toJSON?: boolean;
}

export type ApiError = {
  status: number;
  extra: 'FailedToAwaitJSON' | 'HTTPError';
  response: ApiResponse<unknown>;
};

interface APIClientInterface {
  request<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  get<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  delete<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  head<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  options<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  post<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  put<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
  patch<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;
}

type DefaultConfig = Partial<ApiRequestConfig<unknown>>;
export abstract class AbstractAPIClient implements APIClientInterface {
  private defaultConfig: DefaultConfig | undefined;

  constructor() {
    this.defaultConfig = undefined;
  }

  configure(defaultConfig: DefaultConfig, clearPrevConfig?: boolean) {
    let prev = {};
    if (!clearPrevConfig) {
      prev = this.defaultConfig ?? {};
    }
    this.defaultConfig = { ...defaultConfig, ...prev };
  }

  protected abstract _request<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>>;

  async request<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    return await this._request(url, config);
  }

  async get<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    return await this.request(url, { method: 'GET', ...config });
  }

  async delete<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    return await this.request(url, { method: 'DELETE', ...config });
  }

  async head<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    return await this.request(url, { method: 'HEAD', ...config });
  }

  async options<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    return await this.request(url, { method: 'OPTIONS', ...config });
  }

  async post<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    let body = undefined;
    if (typeof data === 'object') {
      body = JSON.stringify(data);
    }
    return await this.request(url, { method: 'POST', body, ...config });
  }

  async put<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    let body = undefined;
    if (typeof data === 'object') {
      body = JSON.stringify(data);
    }
    return await this.request(url, { method: 'PUT', body, ...config });
  }

  async patch<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    let body = undefined;
    if (typeof data === 'object') {
      body = JSON.stringify(data);
    }
    return await this.request(url, { method: 'PATCH', body, ...config });
  }
}
