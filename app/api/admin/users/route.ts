// app/api/admin/users/route.ts
// All code and comments must be in English.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route uses service_role to bypass RLS
// IMPORTANT: Never expose service_role key to client-side!

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function GET() {
  try {
    // Verify admin access (should check JWT from request in production)
    // For MVP, we'll trust that middleware already checked role
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Fetch all users from auth.users and join with profiles
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Fetch profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, full_name, avatar_url, created_at, updated_at');

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    // Merge auth.users with profiles
    const usersWithProfiles = (authUsers.users || []).map(user => {
      const profile = profiles?.find(p => p.id === user.id);
      return {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        role: profile?.role || 'student',
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        // Use profile created_at if available, otherwise fallback to auth user created_at
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at || null,
        last_sign_in_at: user.last_sign_in_at,
      };
    });

    return NextResponse.json({ users: usersWithProfiles });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update role in profiles table using service_role
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating role:', error);
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { email, password, full_name, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Create user in auth
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name || null,
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return NextResponse.json({ error: createError.message || 'Failed to create user' }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User created but no user data returned' }, { status: 500 });
    }

    // Update profile with role (profile should be created by trigger, but update role if exists)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role,
        full_name: full_name || null,
      })
      .eq('id', authData.user.id);

    // If profile doesn't exist yet, create it
    if (profileError) {
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          role,
          full_name: full_name || null,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        // User is created but profile failed - not critical for MVP
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Delete user from auth (this will cascade delete from profiles via trigger)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

