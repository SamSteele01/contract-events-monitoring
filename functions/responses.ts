
export const createResponse = (body: any) => ({
  statusCode: 200,
  headers: { "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(body),
});

export const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode: statusCode || 501,
  headers: {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
  },
  body: message || "Incorrect id",
});
