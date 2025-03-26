import * as E from 'fp-ts/Either';
import {
  AbstractAPIClient,
  type ApiError,
  type ApiRequestConfig,
  type ApiResponse
} from './base';

export class ApiClient extends AbstractAPIClient {
  protected async _request<T = unknown, R = ApiResponse<T>, D = unknown>(
    url: string,
    config: ApiRequestConfig<D>
  ): Promise<E.Either<ApiError, R>> {
    const response = await fetch(url, config);
    if (!response.ok) {
      return E.left({
        status: response.status,
        extra: 'HTTPError',
        response
      });
    }
    let data = undefined;
    if (config.toJSON === undefined || config.toJSON) {
      try {
        data = await response.json();
      } catch {
        return E.left({
          status: response.status,
          extra: 'FailedToAwaitJSON',
          response
        });
      }
    }
    return E.right({ data, ...response } as R);
  }
}
