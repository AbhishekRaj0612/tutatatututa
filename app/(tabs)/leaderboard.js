import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trophy, Medal, Star, Users, TrendingUp, Award } from 'lucide-react-native';

export default function LeaderboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'All Time' },
  ];

  const categories = [
    { id: 'all', label: 'Overall' },
    { id: 'reporter', label: 'Top Reporters' },
    { id: 'contributor', label: 'Contributors' },
    { id: 'solver', label: 'Problem Solvers' },
  ];

  const topUsers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      score: 2840,
      issues: 47,
      resolved: 31,
      avatar: '👩‍💼',
      badges: ['🏆', '🌟', '🚀'],
      level: 'Champion',
      change: '+12',
    },
    {
      id: 2,
      name: 'Mike Chen',
      score: 2650,
      issues: 52,
      resolved: 28,
      avatar: '👨‍💻',
      badges: ['🥇', '💪', '🎯'],
      level: 'Expert',
      change: '+8',
    },
    {
      id: 3,
      name: 'Emily Davis',
      score: 2410,
      issues: 39,
      resolved: 35,
      avatar: '👩‍🎓',
      badges: ['🥈', '⭐', '🔥'],
      level: 'Expert',
      change: '+15',
    },
  ];

  const leaderboardData = [
    {
      id: 4,
      rank: 4,
      name: 'John Rodriguez',
      score: 2180,
      avatar: '👨‍🔧',
      change: '+3',
    },
    {
      id: 5,
      rank: 5,
      name: 'Lisa Wong',
      score: 1950,
      avatar: '👩‍⚕️',
      change: '-2',
    },
    {
      id: 6,
      rank: 6,
      name: 'David Park',
      score: 1820,
      avatar: '👨‍🎨',
      change: '+7',
    },
    {
      id: 7,
      rank: 7,
      name: 'Anna Martinez',
      score: 1650,
      avatar: '👩‍🏫',
      change: '+1',
    },
    {
      id: 8,
      rank: 8,
      name: 'Tom Wilson',
      score: 1480,
      avatar: '👨‍🚒',
      change: '-3',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Reporter',
      description: 'Submit your first issue report',
      icon: '📍',
      unlocked: true,
    },
    {
      id: 2,
      title: 'Community Hero',
      description: 'Help resolve 10 community issues',
      icon: '🦸',
      unlocked: true,
    },
    {
      id: 3,
      title: 'Eagle Eye',
      description: 'Report 50 valid issues',
      icon: '👁️',
      unlocked: false,
    },
    {
      id: 4,
      title: 'Problem Solver',
      description: 'Contribute to solving 25 issues',
      icon: '🧩',
      unlocked: false,
    },
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#1E40AF';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy size={24} color="#FFD700" />;
      case 2: return <Medal size={24} color="#C0C0C0" />;
      case 3: return <Award size={24} color="#CD7F32" />;
      default: return <Text style={styles.rankNumber}>#{rank}</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community Leaderboard</Text>
        <Text style={styles.subtitle}>Recognizing active community members</Text>
      </View>

      {/* Filter Controls */}
      <View style={styles.filtersSection}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Time Period</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.filterButton,
                    selectedPeriod === period.id && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period.id)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedPeriod === period.id && styles.filterTextActive,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterButton,
                    selectedCategory === category.id && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedCategory === category.id && styles.filterTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podiumSection}>
        <Text style={styles.sectionTitle}>Top Contributors</Text>
        <View style={styles.podium}>
          {/* Second Place */}
          <View style={styles.podiumPlace}>
            <Text style={styles.podiumAvatar}>{topUsers[1].avatar}</Text>
            <View style={[styles.podiumBar, styles.secondPlace]} />
            <Text style={styles.podiumName}>{topUsers[1].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{topUsers[1].score}</Text>
            <Medal size={20} color="#C0C0C0" />
          </View>

          {/* First Place */}
          <View style={styles.podiumPlace}>
            <View style={styles.crownContainer}>
              <Text style={styles.crown}>👑</Text>
            </View>
            <Text style={styles.podiumAvatar}>{topUsers[0].avatar}</Text>
            <View style={[styles.podiumBar, styles.firstPlace]} />
            <Text style={styles.podiumName}>{topUsers[0].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{topUsers[0].score}</Text>
            <Trophy size={20} color="#FFD700" />
          </View>

          {/* Third Place */}
          <View style={styles.podiumPlace}>
            <Text style={styles.podiumAvatar}>{topUsers[2].avatar}</Text>
            <View style={[styles.podiumBar, styles.thirdPlace]} />
            <Text style={styles.podiumName}>{topUsers[2].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{topUsers[2].score}</Text>
            <Award size={20} color="#CD7F32" />
          </View>
        </View>
      </View>

      {/* Top 3 Details */}
      <View style={styles.topThreeSection}>
        {topUsers.map((user, index) => (
          <TouchableOpacity key={user.id} style={styles.topUserCard}>
            <View style={styles.userRank}>
              {getRankIcon(index + 1)}
            </View>
            <Text style={styles.userAvatar}>{user.avatar}</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userLevel}>{user.level}</Text>
              <View style={styles.userStats}>
                <Text style={styles.statText}>{user.issues} reported</Text>
                <Text style={styles.statText}>{user.resolved} resolved</Text>
              </View>
            </View>
            <View style={styles.userScore}>
              <Text style={styles.scoreNumber}>{user.score}</Text>
              <Text style={[
                styles.scoreChange,
                { color: user.change.startsWith('+') ? '#10B981' : '#EF4444' }
              ]}>
                {user.change}
              </Text>
            </View>
            <View style={styles.userBadges}>
              {user.badges.map((badge, badgeIndex) => (
                <Text key={badgeIndex} style={styles.badge}>{badge}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rest of Leaderboard */}
      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Rankings</Text>
        <View style={styles.leaderboardList}>
          {leaderboardData.map((user) => (
            <TouchableOpacity key={user.id} style={styles.leaderboardItem}>
              <View style={styles.itemRank}>
                <Text style={styles.rankNumber}>#{user.rank}</Text>
              </View>
              <Text style={styles.itemAvatar}>{user.avatar}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{user.name}</Text>
                <Text style={styles.itemScore}>{user.score} points</Text>
              </View>
              <Text style={[
                styles.itemChange,
                { color: user.change.startsWith('+') ? '#10B981' : '#EF4444' }
              ]}>
                {user.change}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.lockedAchievement,
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText,
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText,
                  ]}
                >
                  {achievement.description}
                </Text>
              </View>
              <View style={styles.achievementStatus}>
                {achievement.unlocked ? (
                  <Star size={20} color="#F59E0B" />
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>🔒</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Community Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color="#1E40AF" />
            <Text style={styles.statNumber}>2,341</Text>
            <Text style={styles.statLabel}>Active Members</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statNumber}>1,856</Text>
            <Text style={styles.statLabel}>Issues Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>342</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Medal size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
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
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  podiumSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  podiumPlace: {
    alignItems: 'center',
    flex: 1,
  },
  crownContainer: {
    marginBottom: -10,
    zIndex: 1,
  },
  crown: {
    fontSize: 24,
  },
  podiumAvatar: {
    fontSize: 32,
    marginBottom: 8,
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  firstPlace: {
    height: 80,
    backgroundColor: '#FFD700',
  },
  secondPlace: {
    height: 60,
    backgroundColor: '#C0C0C0',
  },
  thirdPlace: {
    height: 40,
    backgroundColor: '#CD7F32',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  topThreeSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 8,
  },
  topUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userRank: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  userAvatar: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userLevel: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  userStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  userScore: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  scoreNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  scoreChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  userBadges: {
    flexDirection: 'row',
    gap: 2,
  },
  badge: {
    fontSize: 12,
  },
  leaderboardSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  itemRank: {
    width: 32,
  },
  itemAvatar: {
    fontSize: 20,
    marginHorizontal: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemScore: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  lockedAchievement: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  achievementStatus: {
    marginLeft: 12,
  },
  lockedBadge: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBadgeText: {
    fontSize: 12,
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});