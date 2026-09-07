import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/db";
import createJWT from "../../utils";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const SALT_ROUNDS = 12;

export const createSUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, branch } = req.body;
    // ---------------- Validation ----------------
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }
    // ---------------- Check existing user ----------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }
    // ---------------- Hash password ----------------
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const getBranch = await prisma.branch.findFirst({
      where: {
        name: {
          equals: branch,
          mode: "insensitive", // "krispy kreme novare" still matches "Krispy Kreme Novare"
        },
      },
    });

    if (!getBranch) {
      return res.status(404).json({
        message: `No branch found matching "${branch}"`,
      });
    }

    // console.log(getBranch);

    // ---------------- Create admin ----------------

    const storeUser = await prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
        name: name?.trim() || null,
        role: "STORE",
        branchId: getBranch?.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        branchId: true,
      },
    });

    return res.status(201).json({
      message: "store acc created successfully",
      storeUser: storeUser,
    });
  } catch (error) {
    console.error("Create store acc error:", error);

    return res.status(500).json({
      message: "Failed to create store acc",
    });
  }
};

export const loginSUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // ---------------- Validation ----------------

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // ---------------- Find user ----------------

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Don't reveal whether the email exists.
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ---------------- Ensure admin ----------------

    if (user.role !== "STORE") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ---------------- Verify password ----------------

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ---------------- Create JWT ----------------

    const token = createJWT(res, user.id, user.role);

    // ---------------- Response ----------------

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
      },
    });
  } catch (error) {
    console.error("User login error:", error);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
};
