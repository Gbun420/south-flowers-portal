import { redirect } from 'next/navigation';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string; error_description?: string };
}) {
  // Handle errors from URL
  if (searchParams.error) {
    console.error('Auth error from URL:', searchParams.error, searchParams.error_description);
    
    if (searchParams.error === 'access_denied') {
      if (searchParams.error_description?.includes('expired')) {
        redirect('/auth/error?error=magic_link_expired');
      } else {
        redirect('/auth/error?error=access_denied');
      }
    } else {
      redirect('/auth/error?error=authentication_failed');
    }
  }

  if (!searchParams.code) {
    console.error('No code in URL');
    redirect('/auth/error?error=no_code_provided');
  }

  // For now, just redirect to login with a success message
  console.log('Auth callback completed - redirecting to login');
  redirect('/login?message=auth_received');
}