export type HealthResponse = {
  status?: string;
  environment?: string;
  version?: string;
};

export async function getHealth(_signal?: AbortSignal): Promise<HealthResponse> {
  return {
    status: "Healthy",
    environment: "Standalone",
    version: "in-app-data",
  };
}
