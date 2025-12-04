import { NextRequest, NextResponse } from 'next/server';

// Demo admin credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
  email: 'admin@mediai.mt',
  password: 'admin123'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}