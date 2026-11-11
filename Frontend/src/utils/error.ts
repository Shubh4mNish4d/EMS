export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  const maybeError = error as {
    response?: { data?: { error?: string } };
    message?: string;
  };

  if (maybeError?.response?.data?.error) return maybeError.response.data.error;
  if (maybeError?.message) return maybeError.message;

  return fallback;
}
