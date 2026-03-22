import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PlanResponse {
  numPlan: number;
  tiltre: string;
  type: string;
  visibilite: string;
  codeService: number;        // ✅ int
  serviceLib: string | null;
  matEmp: number;
  nomPilote: string | null;
  nomsCoPilotes: string[];
  nomsRedacteurs: string[];
  dateCreation: string;
  dateModification: string | null;
  dateCloture: string | null;
  tauxAvencement: number;
  etat: string | null;
  categorie: string | null;
  totalActions: number;
  actionsEnCours: number;
  actionsCloturees: number;
  actionsEnRetard: number;
  estCloture: boolean;
}

export interface CreatePlanRequest {
  tiltre: string;
  type: string;
  visibilite: string;
  codeService: number;        // ✅ int
  matEmp: number;
  categorie: string | null;
  coPilotes: number[];
  redacteurs: number[];
}

export interface UpdatePlanRequest {
  tiltre?: string;
  type?: string;
  visibilite?: string;
  codeService?: number;       // ✅ int
  categorie?: string;
  etat?: string;
}

export interface MembreDisponible {
  matricule: number;
  nomComplet: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/plan`;

  getMesPlans(): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.base}/my`);
  }

  getPublicPlansByService(serviceCode: number): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.base}/usine/${serviceCode}`);
  }

  getAllPublicPlans(): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(`${this.base}/usine`);
  }

  getPlanById(numPlan: number): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.base}/${numPlan}`);
  }

  createPlan(plan: CreatePlanRequest): Observable<PlanResponse> {
    return this.http.post<PlanResponse>(this.base, plan);
  }

  updatePlan(numPlan: number, data: UpdatePlanRequest): Observable<any> {
    return this.http.patch(`${this.base}/${numPlan}`, data);
  }

  validerPlan(numPlan: number): Observable<any> {
    return this.http.post(`${this.base}/${numPlan}/valider`, {});
  }

  cloturerPlan(numPlan: number): Observable<any> {
    return this.http.post(`${this.base}/${numPlan}/cloturer`, {});
  }

  deletePlan(numPlan: number): Observable<any> {
    return this.http.delete(`${this.base}/${numPlan}`);
  }

  getMembresDisponibles(): Observable<MembreDisponible[]> {
    return this.http.get<MembreDisponible[]>(`${this.base}/membres-disponibles`);
  }
}