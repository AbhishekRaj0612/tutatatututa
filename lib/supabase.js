import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth functions
export const signUp = async (email, password, userType = 'user') => {
  if (!email || !password) {
    return { data: null, error: new Error('Email and password are required') };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_type: userType },
      },
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (userId) {
      // Insert user profile (requires RLS policy with WITH CHECK)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            user_type: userType,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    console.error('SignUp error:', error.message);
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log('Signed in successfully:', data);

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    console.error('SignIn error:', error.message);
    return { user: null, session: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Issues functions
export const createIssue = async (issueData) => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .insert([issueData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getIssues = async (filters = {}) => {
  try {
    let query = supabase
      .from('issues')
      .select(`
        *,
        profiles:user_id (
          email,
          user_type
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateIssue = async (issueId, updates) => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', issueId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Community posts functions
export const createPost = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getPosts = async (category = 'all') => {
  try {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          email,
          user_type
        )
      `)
      .order('created_at', { ascending: false });

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Tenders functions
export const createTender = async (tenderData) => {
  try {
    const { data, error } = await supabase
      .from('tenders')
      .insert([tenderData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getTenders = async (status = 'available') => {
  try {
    let query = supabase
      .from('tenders')
      .select(`
        *,
        bids (
          id,
          amount,
          details,
          user_id,
          profiles:user_id (
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createBid = async (bidData) => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .insert([bidData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Feedback functions
export const createFeedback = async (feedbackData) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Municipal officials functions
export const getMunicipalOfficials = async () => {
  try {
    const { data, error } = await supabase
      .from('municipal_officials')
      .select('*')
      .order('department');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
