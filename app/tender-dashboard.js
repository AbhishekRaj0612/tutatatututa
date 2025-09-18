import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, DollarSign, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Search, Plus, Settings, LogOut, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TenderDashboard() {
  const router = useRouter();
  const [contractorName, setContractorName] = useState('Contractor');
  const [selectedFilter, setSelectedFilter] = useState('available');
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDetails, setBidDetails] = useState('');

  useEffect(() => {
    loadContractorData();
  }, []);

  const loadContractorData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setContractorName(email?.split('@')[0] || 'Contractor');
    } catch (error) {
      console.log('Error loading contractor data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/auth');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const stats = {
    availableTenders: 23,
    activeBids: 8,
    wonContracts: 12,
    totalEarnings: '$234,500',
    completionRate: '94%',
    avgBidValue: '$18,200',
  };

  const filters = [
    { id: 'available', label: 'Available', count: 23 },
    { id: 'bidded', label: 'My Bids', count: 8 },
    { id: 'won', label: 'Won', count: 12 },
    { id: 'completed', label: 'Completed', count: 45 },
  ];

  const tenders = [
    {
      id: 1,
      title: 'Road Repair - Main Street Pothole',
      description: 'Complete repair of multiple potholes along Main Street between 1st and 5th Avenue. Includes material supply and labor.',
      category: 'roads',
      location: 'Main Street, Downtown',
      estimatedBudget: '$15,000 - $25,000',
      deadline: '5 days',
      priority: 'high',
      status: 'available',
      postedBy: 'City Works Department',
      postedAt: '2 hours ago',
      requirements: ['Licensed contractor', 'Road repair experience', 'Own equipment'],
      bidsCount: 3,
    },
    {
      id: 2,
      title: 'Park Lighting Installation',
      description: 'Install LED lighting system in Community Park including 12 lamp posts, wiring, and control system.',
      category: 'utilities',
      location: 'Community Park',
      estimatedBudget: '$30,000 - $45,000',
      deadline: '12 days',
      priority: 'medium',
      status: 'available',
      postedBy: 'Parks & Recreation',
      postedAt: '6 hours ago',
      requirements: ['Electrical license', 'LED installation experience', 'Insurance coverage'],
      bidsCount: 1,
    },
    {
      id: 3,
      title: 'Graffiti Removal - Public Buildings',
      description: 'Remove graffiti from 3 public buildings and apply protective coating. Eco-friendly materials required.',
      category: 'maintenance',
      location: 'Multiple locations',
      estimatedBudget: '$5,000 - $8,000',
      deadline: '7 days',
      priority: 'low',
      status: 'bidded',
      postedBy: 'Facilities Management',
      postedAt: '1 day ago',
      requirements: ['Cleaning experience', 'Eco-friendly materials', 'Background check'],
      bidsCount: 5,
      myBid: '$6,200',
    },
    {
      id: 4,
      title: 'Playground Equipment Repair',
      description: 'Repair and safety inspection of playground equipment at Lincoln Elementary School playground.',
      category: 'parks',
      location: 'Lincoln Elementary School',
      estimatedBudget: '$8,000 - $12,000',
      deadline: '10 days',
      priority: 'medium',
      status: 'won',
      postedBy: 'School District',
      postedAt: '3 days ago',
      requirements: ['Playground equipment certified', 'Safety inspection license', 'Child safety training'],
      bidsCount: 7,
      myBid: '$9,500',
      awardDate: 'Yesterday',
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      roads: '#EF4444',
      utilities: '#F59E0B',
      maintenance: '#10B981',
      parks: '#8B5CF6',
      environment: '#06B6D4',
    };
    return colors[category] || '#6B7280';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#1E40AF';
      case 'bidded': return '#F59E0B';
      case 'won': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <FileText size={16} color="#1E40AF" />;
      case 'bidded': return <Clock size={16} color="#F59E0B" />;
      case 'won': return <CheckCircle size={16} color="#10B981" />;
      case 'completed': return <CheckCircle size={16} color="#6B7280" />;
      default: return <AlertTriangle size={16} color="#6B7280" />;
    }
  };

  const handleBid = (tender) => {
    setSelectedTender(tender);
    setShowBidForm(true);
    setBidAmount('');
    setBidDetails('');
  };

  const submitBid = () => {
    if (!bidAmount || !bidDetails) {
      Alert.alert('Error', 'Please fill in all bid information');
      return;
    }

    Alert.alert(
      'Bid Submitted',
      `Your bid of $${bidAmount} has been submitted successfully!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowBidForm(false);
            setSelectedTender(null);
            setBidAmount('');
            setBidDetails('');
          },
        },
      ]
    );
  };

  const filteredTenders = tenders.filter(tender => {
    switch (selectedFilter) {
      case 'available': return tender.status === 'available';
      case 'bidded': return tender.status === 'bidded';
      case 'won': return tender.status === 'won';
      case 'completed': return tender.status === 'completed';
      default: return true;
    }
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Contractor Portal</Text>
          <Text style={styles.contractorName}>Welcome, {contractorName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Business Overview</Text>
        <View style={styles.statsGrid}>
          {Object.entries(stats).map(([key, value]) => (
            <View key={key} style={styles.statCard}>
              <View style={styles.statHeader}>
                {/* Replace with correct icon based on key if needed */}
                <Text style={styles.statNumber}>{value}</Text>
              </View>
              <Text style={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1')}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Tender Opportunities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter.id && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                <View style={styles.filterChipBadge}>
                  <Text style={styles.filterChipBadgeText}>{filter.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Tenders List */}
      <View style={styles.tendersSection}>
        <View style={styles.tendersList}>
          {filteredTenders.map((tender) => (
            <View key={tender.id} style={styles.tenderCard}>
              {/* Tender Header */}
              <View style={styles.tenderHeader}>
                <View style={styles.tenderStatus}>
                  {getStatusIcon(tender.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(tender.status) }]}>
                    {tender.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.tenderMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(tender.priority) }]}>
                    <Text style={styles.priorityText}>{tender.priority.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tender.category) + '20' }]}>
                    <Text style={[styles.categoryText, { color: getCategoryColor(tender.category) }]}>
                      {tender.category}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tender Title and Description */}
              <Text style={styles.tenderTitle}>{tender.title}</Text>
              <Text style={styles.tenderDescription}>{tender.description}</Text>

              {/* Tender Details */}
              <View style={styles.tenderDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.detailText}>Location: {tender.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <DollarSign size={14} color="#10B981" />
                  <Text style={styles.detailText}>Budget: {tender.estimatedBudget}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#F59E0B" />
                  <Text style={styles.detailText}>Deadline: {tender.deadline}</Text>
                </View>
              </View>

              {/* Requirements */}
              <View style={styles.requirementsSection}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                {tender.requirements.map((req, index) => (
                  <Text key={index} style={styles.requirement}>• {req}</Text>
                ))}
              </View>

              {/* Tender Info */}
              <View style={styles.tenderInfo}>
                <Text style={styles.tenderInfoText}>
                  Posted by {tender.postedBy} • {tender.postedAt} • {tender.bidsCount} bids
                </Text>
              </View>

              {/* My Bid Info */}
              {tender.myBid && (
                <View style={styles.myBidInfo}>
                  <Text style={styles.myBidText}>
                    Your bid: {tender.myBid}
                    {tender.awardDate && ` • Awarded ${tender.awardDate}`}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.tenderActions}>
                {tender.status === 'available' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.bidButton]}
                    onPress={() => handleBid(tender)}
                  >
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.bidButtonText}>Submit Bid</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>

                {tender.status === 'won' && (
                  <TouchableOpacity style={[styles.actionButton, styles.startButton]}>
                    <Text style={styles.startButtonText}>Start Work</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Bid Form Modal */}
      {showBidForm && selectedTender && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Bid</Text>
            <Text style={styles.modalSubtitle}>{selectedTender.title}</Text>

            <View style={styles.bidForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bid Amount ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bid Details</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your approach, timeline, materials, etc."
                  value={bidDetails}
                  onChangeText={setBidDetails}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowBidForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitBid}
              >
                <Text style={styles.submitButtonText}>Submit Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  contractorName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
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
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  filterChipBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  tendersSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  tendersList: {
    gap: 20,
  },
  tenderCard: {
    backgroundColor: '#F9FAFB',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tenderMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tenderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  tenderDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tenderDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  tenderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginBottom: 12,
  },
  tenderInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  myBidInfo: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  myBidText: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: '600',
  },
  tenderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    gap: 6,
  },
  bidButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#E5E7EB',
  },
  detailsButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  bidForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});