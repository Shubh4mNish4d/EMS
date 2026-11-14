export function getErrorMessage(error: any, fallback = "Something went wrong") {
  if (typeof error === "string") return error;

  const maybeError = error as {
    response?: { data?: { error?: string } };
    message?: string;
  };
  
  if (maybeError?.response?.data?.error) return maybeError.response.data.error;
  if (maybeError?.response?.data) return maybeError.response.data;
  if (maybeError?.message) return maybeError.message;

  return fallback;
}
