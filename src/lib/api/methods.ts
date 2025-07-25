import { apiClient } from "./apiClient";
import {
  LoginRequest,
  LoginResponse,
  PrinterApiResponse,
  MapStatsResponse,
  MapScansResponse,
  CreateProductRequest,
  ProductApiResponse,
  ProductsFilter,
  ProductResponse,
  UpdateProductRequest,
  QRFilters,
  BulkQRCreateRequest,
  ListQRResponse
} from "./types";

// Dashboard API Methods
export const getMapStats = async (timeRange: string = "30d", companyId?: string): Promise<MapStatsResponse> => {
  const params = new URLSearchParams();
  params.append("time_range", timeRange);
  if (companyId) {
    params.append("company_id", companyId);
  }

  const response = await apiClient.get(`/api/fingerprints/map/stats/?${params.toString()}`);
  return response.data;
};

export const getMapScans = async (
  timeRange: string = "30d",
  authenticationResult?: string,
  search?: string,
  sortBy: string = "latest",
  status?: string,
  version?: string,
  hasLocation: boolean = true,
  page: number = 1,
  pageSize: number = 100,
  companyId?: string,
  startDate?: string,
  endDate?: string
): Promise<MapScansResponse> => {
  const params = new URLSearchParams();

  if (timeRange !== "custom") {
    params.append("time_range", timeRange);
  }
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  if (authenticationResult) params.append("authentication_result", authenticationResult);
  if (search) params.append("search", search);
  params.append("sort_by", sortBy);
  if (status) params.append("status", status);
  if (version) params.append("version", version);
  params.append("has_location", hasLocation.toString());
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());
  if (companyId) params.append("company_id", companyId);

  const response = await apiClient.get(`/api/fingerprints/map/scans/?${params.toString()}`);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/api/auth/login/", data);
  return response.data;
};

export const getAllPrinters = async (page = 1, limit = 10): Promise<PrinterApiResponse> => {
  const response = await apiClient.get(`/api/printers/?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAllProducts = async (page = 1, limit = 10): Promise<ProductApiResponse> => {
  const response = await apiClient.get(`/api/products/products/?page=${page}`);
  return response.data;
};

export const getAllProductsQuery = async (args?: ProductsFilter, page = 1, limit = 10): Promise<ProductApiResponse> => {
  const response = await apiClient.get(`/api/products/products/?status=${args.status}&search=${args.search}`);
  return response.data;
};

export const createProduct = async (data: CreateProductRequest): Promise<ProductResponse> => {
  const response = await apiClient.post("/api/products/products/", data);
  return response.data;
};

export const getProduct = async (id: string): Promise<ProductResponse> => {
  const response = await apiClient.get(`/api/products/products/${id}/`);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductRequest) => {
  const response = await apiClient.patch(`/api/products/products/${id}/`, data);
  return response;
};

export const deleteProduct = async (id: string) => {
  await apiClient.delete(`/api/products/products/${id}/`);
};

export const createQR = async (data: BulkQRCreateRequest) => {
  const response = await apiClient.post(`/api/fingerprints/qr_fingerprints/bulk_create/`, data);
  return response;
};

export const listQR = async (page = 1, limit = 10): Promise<ListQRResponse> => {
  const response = await apiClient.get(`/api/fingerprints/qr_fingerprints/?&all=true`);
  return response.data;
};

export const listQRQuery = async (args?: QRFilters, page = 1, limit = 10): Promise<ListQRResponse> => {
  const { search, sort, status } = args;
  const response = await apiClient.get(
    `/api/fingerprints/qr_fingerprints/?search=${search}&sort=${sort}&status=${status}`
  );
  return response.data;
};
