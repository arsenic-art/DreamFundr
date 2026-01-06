export const healthCheck = (_req: any, res: any) => {
  res.json({ status: "ok", message: "DreamFundr API is running" });
};
