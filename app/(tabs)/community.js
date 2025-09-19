import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MessageSquare, Heart, Share, Send, Plus, Filter, Search, TrendingUp } from 'lucide-react-native';

export default function CommunityScreen() {
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const filters = [
    { id: 'all', label: 'All Posts', count: 234 },
    { id: 'discussions', label: 'Discussions', count: 89 },
    { id: 'announcements', label: 'Announcements', count: 23 },
    { id: 'suggestions', label: 'Suggestions', count: 67 },
    { id: 'events', label: 'Events', count: 12 },
  ];

  const posts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '👩‍💼',
      time: '2 hours ago',
      content: 'Great to see the pothole on Main Street finally getting fixed! Thanks to everyone who reported it. This is what community collaboration looks like! 🎉',
      likes: 24,
      comments: 8,
      shares: 3,
      category: 'discussions',
      isLiked: true,
      tags: ['infrastructure', 'success'],
    },
    {
      id: 2,
      author: 'City Council',
      avatar: '🏛️',
      time: '5 hours ago',
      content: 'Reminder: Community Town Hall meeting this Saturday at 2 PM in the Municipal Building. We\'ll be discussing the new park development project and taking your feedback.',
      likes: 45,
      comments: 12,
      shares: 18,
      category: 'announcements',
      isLiked: false,
      tags: ['official', 'meeting'],
      isOfficial: true,
    },
    {
      id: 3,
      author: 'Mike Chen',
      avatar: '👨‍💻',
      time: '1 day ago',
      content: 'Has anyone else noticed the increase in bike thefts near the university area? Maybe we could organize a neighborhood watch group or suggest better lighting to the city.',
      likes: 18,
      comments: 15,
      shares: 7,
      category: 'discussions',
      isLiked: false,
      tags: ['safety', 'community'],
    },
    {
      id: 4,
      author: 'Emily Davis',
      avatar: '👩‍🎓',
      time: '2 days ago',
      content: 'Suggestion: What if we had a mobile app feature where residents can vote on which issues should be prioritized? This would help the city focus on what matters most to us.',
      likes: 32,
      comments: 22,
      shares: 11,
      category: 'suggestions',
      isLiked: true,
      tags: ['tech', 'innovation'],
    },
  ];

  const trendingTopics = [
    { id: 1, tag: 'infrastructure', posts: 45 },
    { id: 2, tag: 'safety', posts: 32 },
    { id: 3, tag: 'environment', posts: 28 },
    { id: 4, tag: 'transportation', posts: 24 },
    { id: 5, tag: 'events', posts: 18 },
  ];

  const handleLike = (postId) => {
    Alert.alert('Liked!', 'Post has been liked');
  };

  const handleComment = (postId) => {
    Alert.alert('Comment', 'Comment feature coming soon!');
  };

  const handleShare = (postId) => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const submitPost = () => {
    if (!newPost.trim()) {
      Alert.alert('Error', 'Please write something to post');
      return;
    }

    Alert.alert('Success', 'Your post has been published!', [
      {
        text: 'OK',
        onPress: () => {
          setNewPost('');
          setShowNewPost(false);
        },
      },
    ]);
  };

  const getCategoryColor = (category) => {
    const colors = {
      discussions: '#1E40AF',
      announcements: '#EF4444',
      suggestions: '#10B981',
      events: '#8B5CF6',
    };
    return colors[category] || '#6B7280';
  };

  const filteredPosts = posts.filter(post =>
    selectedFilter === 'all' || post.category === selectedFilter
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect and collaborate with neighbors</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search discussions, announcements..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#1E40AF" />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.categoryFilter,
                  selectedFilter === filter.id && styles.categoryFilterActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.categoryFilterText,
                    selectedFilter === filter.id && styles.categoryFilterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>{filter.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* New Post Button */}
      <View style={styles.newPostSection}>
        {!showNewPost ? (
          <TouchableOpacity
            style={styles.newPostButton}
            onPress={() => setShowNewPost(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.newPostButtonText}>Share with Community</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.newPostForm}>
            <TextInput
              style={styles.newPostInput}
              placeholder="What's on your mind? Share updates, questions, or suggestions..."
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={3}
            />
            <View style={styles.newPostActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowNewPost(false);
                  setNewPost('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postButton} onPress={submitPost}>
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Trending Topics */}
      <View style={styles.trendingSection}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.trendingList}>
            {trendingTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.trendingItem}>
                <TrendingUp size={16} color="#1E40AF" />
                <Text style={styles.trendingTag}>#{topic.tag}</Text>
                <Text style={styles.trendingCount}>{topic.posts} posts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <View style={styles.feedSection}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        <View style={styles.postsContainer}>
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <Text style={styles.postAvatar}>{post.avatar}</Text>
                <View style={styles.postAuthorInfo}>
                  <View style={styles.authorRow}>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                    {post.isOfficial && (
                      <View style={styles.officialBadge}>
                        <Text style={styles.officialBadgeText}>Official</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>
                <TouchableOpacity style={styles.postOptions}>
                  <Text style={styles.postOptionsText}>⋯</Text>
                </TouchableOpacity>
              </View>

              {/* Post Content */}
              <Text style={styles.postContent}>{post.content}</Text>

              {/* Post Tags */}
              <View style={styles.postTags}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <Heart
                    size={18}
                    color={post.isLiked ? '#EF4444' : '#6B7280'}
                    fill={post.isLiked ? '#EF4444' : 'transparent'}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      post.isLiked && { color: '#EF4444' },
                    ]}
                  >
                    {post.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleComment(post.id)}
                >
                  <MessageSquare size={18} color="#6B7280" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(post.id)}
                >
                  <Share size={18} color="#6B7280" />
                  <Text style={styles.actionText}>{post.shares}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  categoryFilterActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  newPostSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,

    // ✅ new unified shadow API
    boxShadow: "0px 4px 8px rgba(30, 64, 175, 0.3)",

    // ✅ keep elevation for Android
    elevation: 8,
  },
  newPostButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newPostForm: {
    gap: 12,
  },
  newPostInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trendingSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  trendingList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  trendingTag: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  trendingCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  feedSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  postsContainer: {
    gap: 16,
  },
  postCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAvatar: {
    fontSize: 20,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  officialBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  postOptions: {
    padding: 4,
  },
  postOptionsText: {
    fontSize: 16,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});