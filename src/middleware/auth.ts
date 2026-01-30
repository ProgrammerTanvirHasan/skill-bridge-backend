import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export enum userRole {
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

const middleware = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { status: true },
      });
      if (dbUser?.status === "BANNED") {
        return res.status(403).json({ message: "Account is suspended" });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
      };
      if (roles.length && !roles.includes(req.user.role as userRole)) {
        return res.status(403).json({ message: "Forbidden Access" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default middleware;
