
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  supabaseConfigured: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast('Failed to fetch user profile', {
        description: 'Please try signing in again.'
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // First, check if the profiles table exists
      const { error: tableCheckError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.message.includes('relation "profiles" does not exist')) {
        throw new Error('The database tables are not set up correctly. Please run database migrations first.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email,
              username: email.split('@')[0],
              learning_style: 'visual'
            }
          ]);
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(`Failed to create user profile: ${profileError.message}`);
        }
      }
      
      toast('Account created successfully!', {
        description: 'Please check your email to confirm your account.'
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      if (error.message.includes('relation "profiles" does not exist')) {
        errorMessage = 'Database tables are not set up. Please contact the administrator.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast('Signup failed', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      
      toast('Successfully signed in!', {
        description: 'Welcome back to AI Tutor'
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast('Sign in failed', {
        description: error.message || 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setProfile(null);
      navigate('/login');
      
      toast('Signed out successfully');
    } catch (error: any) {
      toast('Sign out failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signUp,
        signIn,
        signOut,
        loading,
        supabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
