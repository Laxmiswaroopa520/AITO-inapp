//Confirms the in-memory data layer that powers standalone mode has initialized.

/*TanStack Query (formerly React Query) is a library that helps React applications fetch, cache, synchronize, and update data from APIs.
Think of it as a smart data manager between your React UI and your backend API.*/
import {
  useQuery,
} from "@tanstack/react-query";

import {
  ApiError,
} from "../../api/apiError";

import {
  getHealth,
} from "../../api/getHealth";

import {
  ErrorState,
} from "../../components/feedback/ErrorState";

import {
  LoadingSpinner,
} from "../../components/feedback/LoadingSpinner";

export function HealthDiagnosticPage() {
  const healthQuery = useQuery({                                    //instead of fetch we will use useQUery..
    queryKey: [
      "api-health",
    ],

    queryFn: ({ signal }) =>
      getHealth(signal),
  });

  if (healthQuery.isPending) {
    return (
      <LoadingSpinner
        message={
          "Checking API connectivity..."
        }
      />
    );
  }

  if (healthQuery.isError) {
    const error = healthQuery.error;

    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "An unknown error occurred.";

    return (
      <ErrorState
        title="API connection failed"
        message={message}
        onRetry={() => {
          void healthQuery.refetch();
        }}
      />
    );
  }

  const health = healthQuery.data;

  return (
    <section>
      <h1>API Diagnostics</h1>

      <p>
        This page confirms the in-memory data layer
        that powers Frontier Accelerator App
        in standalone mode is initialized and responding.
      </p>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "white",
        }}
      >
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: "12px",
            margin: 0,
          }}
        >
          <dt>
            <strong>API status</strong>
          </dt>

          <dd style={{ margin: 0 }}>
            {health.status}
          </dd>

          <dt>
            <strong>Environment</strong>
          </dt>

          <dd style={{ margin: 0 }}>
            {health.environment}
          </dd>

          <dt>
            <strong>Version</strong>
          </dt>

          <dd style={{ margin: 0 }}>
            {health.version}
          </dd>
        </dl>
      </div>

      <button
        type="button"
        onClick={() => {
          void healthQuery.refetch();
        }}
        disabled={healthQuery.isFetching}
        style={{
          marginTop: "16px",
          padding: "10px 16px",
        }}
      >
        {healthQuery.isFetching
          ? "Checking..."
          : "Check again"}
      </button>
    </section>
  );
}
