import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  private static readonly JWT_EXPIRES_IN = '24h';

  static async login(credentials: unknown) {
    try {
      // Validate input
      const validated = loginSchema.parse(credentials);
      
      // For demo, use hardcoded admin check
      if (validated.email !== 'admin@mediai.mt' || validated.password !== 'admin123') {
        throw new Error('Invalid credentials');
      }

      // Generate simple token for demo
      const token = AuthService.generateSecureToken();

      return {
        success: true,
        token,
        user: {
          id: 1,
          email: validated.email,
          name: 'Administrator',
          role: 'admin'
        }
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map((e: any) => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  static async register(userData: unknown) {
    try {
      // Validate input
      const validated = registerSchema.parse(userData);
      
      // For demo, skip user creation check
      const hashedPassword = await bcrypt.hash(validated.password, 12);

      // Mock user creation
      const user = {
        id: 1,
        email: validated.email.toLowerCase(),
        name: validated.name,
        role: 'user'
      };

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role 
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map((e: any) => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  static verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateSecureToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}