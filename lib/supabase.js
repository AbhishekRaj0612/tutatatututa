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
export const signUp = async (email, password, userType = 'user', profileData) => {
  try {
    // First, create the user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: profileData.fullName || profileData.firstName + ' ' + profileData.lastName,
        }
      }
    });

    if (error) {
      console.error('Auth signup error:', error);
      return { error };
    }

    // If user creation was successful and we have a user
    if (data.user) {
      // Wait a moment for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 100));

      // Now create the profile record - FIXED: removed user_id field
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id, // This is the primary key that references auth.users(id)
            email: email, // Add email field
            first_name: profileData.firstName || '',
            last_name: profileData.lastName || '',
            full_name: profileData.fullName || (profileData.firstName + ' ' + profileData.lastName),
            phone: profileData.phone || '',
            address: profileData.address || '',
            city: profileData.city || '',
            state: profileData.state || '',
            postal_code: profileData.postalCode || '',
            user_type: userType,
            is_verified: false, // Will be updated when email is verified
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        return { error: profileError };
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('SignUp error:', error);
    return { error };
  }
};

export const sendVerificationEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login time
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);
    }

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

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
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
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Ensure user_id is set
    const issueWithUserId = {
      ...issueData,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('issues')
      .insert([issueWithUserId])
      .select(`
        *,
        profiles:user_id (
          email,
          user_type,
          full_name,
          first_name,
          last_name
        )
      `)
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
          user_type,
          full_name,
          first_name,
          last_name
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

export const getIssueById = async (issueId) => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        profiles:user_id (
          email,
          user_type,
          full_name,
          first_name,
          last_name
        )
      `)
      .eq('id', issueId)
      .single();

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
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', issueId)
      .select(`
        *,
        profiles:user_id (
          email,
          user_type,
          full_name,
          first_name,
          last_name
        )
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Enhanced issues functions with location support
export const getIssuesWithLocation = async (filters = {}) => {
  try {
    let query = supabase
      .from('issues')
      .select(`
        *,
        profiles:user_id (
          email,
          user_type,
          full_name,
          first_name,
          last_name
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

    if (filters.area) {
      query = query.eq('area', filters.area);
    }

    if (filters.ward) {
      query = query.eq('ward', filters.ward);
    }

    // Location-based filtering
    if (filters.bounds) {
      const { north, south, east, west } = filters.bounds;
      query = query
        .gte('latitude', south)
        .lte('latitude', north)
        .gte('longitude', west)
        .lte('longitude', east);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Issue voting functions
export const voteOnIssue = async (issueId, voteType) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // First, check if user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('issue_votes')
      .select('*')
      .eq('issue_id', issueId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }

    let voteData;

    if (existingVote) {
      // Update existing vote
      if (existingVote.vote_type === voteType) {
        // Same vote - remove it
        const { error: deleteError } = await supabase
          .from('issue_votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) throw deleteError;
        voteData = null;
      } else {
        // Different vote - update it
        const { data, error: updateError } = await supabase
          .from('issue_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id)
          .select()
          .single();

        if (updateError) throw updateError;
        voteData = data;
      }
    } else {
      // Create new vote
      const { data, error: insertError } = await supabase
        .from('issue_votes')
        .insert([{
          issue_id: issueId,
          user_id: user.id,
          vote_type: voteType
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      voteData = data;
    }

    // Update issue vote counts
    const { data: votes, error: countError } = await supabase
      .from('issue_votes')
      .select('vote_type')
      .eq('issue_id', issueId);

    if (countError) throw countError;

    const upvotes = votes.filter(v => v.vote_type === 'upvote').length;
    const downvotes = votes.filter(v => v.vote_type === 'downvote').length;

    const { error: updateIssueError } = await supabase
      .from('issues')
      .update({ upvotes, downvotes })
      .eq('id', issueId);

    if (updateIssueError) throw updateIssueError;

    return { data: voteData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get user's vote on an issue
export const getUserVote = async (issueId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from('issue_votes')
      .select('vote_type')
      .eq('issue_id', issueId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Issue comments functions
export const createIssueComment = async (issueId, content, attachments = []) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('issue_comments')
      .insert([{
        issue_id: issueId,
        user_id: user.id,
        content,
        attachments
      }])
      .select(`
        *,
        profiles:user_id (
          full_name,
          first_name,
          last_name,
          user_type
        )
      `)
      .single();

    if (error) throw error;

    // Update comment count
    const { data: comments } = await supabase
      .from('issue_comments')
      .select('id')
      .eq('issue_id', issueId);

    await supabase
      .from('issues')
      .update({ comments_count: comments?.length || 0 })
      .eq('id', issueId);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getIssueComments = async (issueId) => {
  try {
    const { data, error } = await supabase
      .from('issue_comments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          first_name,
          last_name,
          user_type
        )
      `)
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get unique areas for filtering
export const getAreas = async () => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('area')
      .not('area', 'is', null)
      .order('area');

    if (error) throw error;

    // Get unique areas
    const uniqueAreas = [...new Set(data.map(item => item.area))].filter(Boolean);
    return { data: uniqueAreas, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get unique wards for filtering
export const getWards = async () => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('ward')
      .not('ward', 'is', null)
      .order('ward');

    if (error) throw error;

    // Get unique wards
    const uniqueWards = [...new Set(data.map(item => item.ward))].filter(Boolean);
    return { data: uniqueWards, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Community posts functions
export const createPost = async (postData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const postWithUserId = {
      ...postData,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert([postWithUserId])
      .select(`
        *,
        profiles:user_id (
          email,
          user_type,
          full_name,
          first_name,
          last_name
        )
      `)
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
          user_type,
          full_name,
          first_name,
          last_name
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const tenderWithUserId = {
      ...tenderData,
      posted_by: user.id,
    };

    const { data, error } = await supabase
      .from('tenders')
      .insert([tenderWithUserId])
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
          status,
          profiles:user_id (
            email,
            full_name
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const bidWithUserId = {
      ...bidData,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('bids')
      .insert([bidWithUserId])
      .select(`
        *,
        profiles:user_id (
          email,
          full_name
        ),
        tenders:tender_id (
          title
        )
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get user's bids
export const getUserBids = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        tenders:tender_id (
          title,
          status,
          deadline_date
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Feedback functions
export const createFeedback = async (feedbackData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Allow anonymous feedback
    let feedbackWithUserId = feedbackData;
    if (user) {
      feedbackWithUserId.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackWithUserId])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get user's feedback
export const getUserFeedback = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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
      .eq('is_active', true)
      .order('department', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Notifications functions
export const getUserNotifications = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Utility function to handle auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};