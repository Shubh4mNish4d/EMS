export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  console.log(error instanceof Error)
  if (typeof error === "string") return error;

  const maybeError = error as {
    response?: { data?: { error?: string } };
    message?: string;
  };
  
  if (maybeError?.response?.data?.error) return maybeError.response.data.error;
  if (maybeError?.message) return maybeError.message;

  return fallback;
}
