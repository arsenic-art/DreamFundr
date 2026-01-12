export const getErrorMessage = (error: any): string => {
  return (
    error.message ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Something went wrong. Please try again."
  );
};
