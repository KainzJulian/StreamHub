import { HttpClient } from '@angular/common/http';
import { BackendResponse } from './response';
import { map, Observable } from 'rxjs';

export class HttpRequestHandler {
  constructor(private http: HttpClient) {
    this.http = http;
  }

  get<T>(url: string): Observable<BackendResponse<T>> {
    return this.http
      .get<BackendResponse<T>>(url)
      .pipe(HttpRequestHandler.checkBackendResponse<T>());
  }

  post<T>(url: string, body: unknown = null): Observable<BackendResponse<T>> {
    return this.http
      .post<BackendResponse<T>>(url, body)
      .pipe(HttpRequestHandler.checkBackendResponse<T>());
  }

  put<T>(
    url: string,
    body: unknown = undefined
  ): Observable<BackendResponse<T>> {
    return this.http
      .put<BackendResponse<T>>(url, body)
      .pipe(HttpRequestHandler.checkBackendResponse<T>());
  }

  public static checkBackendResponse<T>() {
    return map<BackendResponse<T>, BackendResponse<T>>((response) => {
      if (!response.success || response.error)
        throw new Error(
          response.error ||
            'Error while performing Task: Error message is not defined by backend'
        );

      return response;
    });
  }
}
