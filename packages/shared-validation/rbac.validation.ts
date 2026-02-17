export const authorize = (requiredPermission: string) => {
  //Ex router.post("/sites",authenticate,authorize("site:create"),SiteController.create);
  return (req: any, res: any, next: any) => {
    const userPermissions = req.user?.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};