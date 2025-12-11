import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHARED_EMAIL = "itadsecure@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    
    if (!password) {
      console.log('No password provided');
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storedPassword = Deno.env.get('SHARED_ACCESS_PASSWORD');
    
    if (!storedPassword) {
      console.error('SHARED_ACCESS_PASSWORD secret not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate password
    if (password !== storedPassword) {
      console.log('Invalid password attempt');
      return new Response(
        JSON.stringify({ error: 'Incorrect password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Password is correct - sign in or create the shared account
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: SHARED_EMAIL,
      password: storedPassword,
    });

    if (signInError) {
      // If user doesn't exist, create them
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Creating shared user account');
        
        const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
          email: SHARED_EMAIL,
          password: storedPassword,
          email_confirm: true,
        });

        if (signUpError) {
          console.error('Failed to create user:', signUpError.message);
          return new Response(
            JSON.stringify({ error: 'Failed to create account' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Sign in the newly created user
        const { data: newSignInData, error: newSignInError } = await supabaseAdmin.auth.signInWithPassword({
          email: SHARED_EMAIL,
          password: storedPassword,
        });

        if (newSignInError) {
          console.error('Failed to sign in new user:', newSignInError.message);
          return new Response(
            JSON.stringify({ error: 'Authentication failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('User created and signed in successfully');
        return new Response(
          JSON.stringify({ 
            session: newSignInData.session,
            user: newSignInData.user 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.error('Sign in error:', signInError.message);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User signed in successfully');
    return new Response(
      JSON.stringify({ 
        session: signInData.session,
        user: signInData.user 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-access function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
