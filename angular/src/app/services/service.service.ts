import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ServiceItem {
  code: number;
  lib: string;
}

export interface ServiceItemFull {
  code: number;
  lib: string;
  dateDesactivation: string | null;
}

export interface CreateServiceDto {
  lib: string;
  dateDesactivation?: string | null;
}

export interface UpdateServiceDto {
  lib: string;
  dateDesactivation?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/service`;

  private allCache$: Observable<ServiceItem[]> | null = null;
  private mesCache$: Observable<ServiceItem[]> | null = null;

  getActiveServices(): Observable<ServiceItem[]> {
    if (!this.allCache$) {
      this.allCache$ = this.http.get<ServiceItem[]>(this.baseUrl).pipe(shareReplay(1));
    }
    return this.allCache$;
  }

  getMesServices(): Observable<ServiceItem[]> {
    if (!this.mesCache$) {
      this.mesCache$ = this.http
        .get<ServiceItem[]>(`${this.baseUrl}/mes-services`)
        .pipe(shareReplay(1));
    }
    return this.mesCache$;
  }

  getAllServices(): Observable<ServiceItemFull[]> {
    return this.http.get<ServiceItemFull[]>(`${this.baseUrl}/all`);
  }

  createService(dto: CreateServiceDto): Observable<ServiceItemFull> {
    return this.http.post<ServiceItemFull>(this.baseUrl, dto).pipe(tap(() => this.clearCache()));
  }

  updateService(code: number, dto: UpdateServiceDto): Observable<ServiceItemFull> {
    return this.http.put<ServiceItemFull>(`${this.baseUrl}/${code}`, dto).pipe(tap(() => this.clearCache()));
  }

  deleteService(code: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${code}`).pipe(tap(() => this.clearCache()));
  }

  clearCache(): void {
    this.allCache$ = null;
    this.mesCache$ = null;
  }
}