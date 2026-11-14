export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (typeof error === "string") return error;

  const maybeError = error as {
    response?: { data?: unknown };
    message?: string;
    error?: string;
  };

  const responseData = maybeError?.response?.data;
  if (typeof responseData === "string") return responseData;

  if (responseData && typeof responseData === "object") {
    const data = responseData as { error?: unknown; message?: unknown };

    if (typeof data.error === "string" && data.error.trim()) return data.error;
    if (typeof data.message === "string" && data.message.trim()) return data.message;

    try {
      return JSON.stringify(data) || fallback;
    } catch {
      return fallback;
    }
  }

  if (typeof maybeError?.message === "string" && maybeError.message.trim()) return maybeError.message;
  if (typeof maybeError?.error === "string" && maybeError.error.trim()) return maybeError.error;

  return fallback;
}
