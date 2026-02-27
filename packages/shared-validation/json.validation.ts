export const jsonValidation = () => {
  return (req: any, res: any, next: any) => {
    if (
      req.method !== 'GET' &&
      req.headers['content-type'] &&
      !req.headers['content-type'].includes('application/json')
    ) {
      return res
        .status(415)
        .json({ error: 'Content-Type must be application/json' });
    }
    next();
  };
};
