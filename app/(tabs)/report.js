import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Camera, MapPin, Upload, Send, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { createIssue, getCurrentUser } from '../../lib/supabase';
import { uploadMultipleImages } from '../../lib/cloudinary';
import { useTranslation } from 'react-i18next';

export default function ReportScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'roads', label: t('category.roads'), color: '#EF4444' },
    { id: 'utilities', label: t('category.utilities'), color: '#F59E0B' },
    { id: 'environment', label: t('category.environment'), color: '#10B981' },
    { id: 'safety', label: t('category.safety'), color: '#8B5CF6' },
    { id: 'other', label: t('category.other'), color: '#6B7280' },
  ];

  const priorities = [
    { id: 'low', label: t('priority.low'), color: '#10B981' },
    { id: 'medium', label: t('priority.medium'), color: '#F59E0B' },
    { id: 'high', label: t('priority.high'), color: '#EF4444' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    // Mock function - in real app, use expo-location
    setFormData({ ...formData, location: 'Current Location (Mock)' });
    Alert.alert(t('common.success'), 'Location captured successfully!');
  };

  const submitReport = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;
      
      if (!user) {
        Alert.alert(t('common.error'), 'You must be logged in to report issues');
        return;
      }

      // Upload images to Cloudinary if any
      let imageUrls = [];
      if (selectedImages.length > 0) {
        const imageUris = selectedImages.map(img => img.uri);
        const uploadResult = await uploadMultipleImages(imageUris);
        
        if (uploadResult.error && uploadResult.successful.length === 0) {
          Alert.alert(t('common.error'), 'Failed to upload images');
          return;
        }
        
        imageUrls = uploadResult.successful.map(result => result.url);
      }

      // Create issue in Supabase
      const issueData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        images: imageUrls,
        status: 'pending',
      };

      const { data, error } = await createIssue(issueData);
      if (error) throw error;

      Alert.alert(
        t('common.success'),
        'Your report has been submitted successfully! You will receive updates on its status.',
        [{ 
          text: t('common.ok'), 
          onPress: () => {
            setFormData({
              title: '',
              description: '',
              category: '',
              location: '',
              priority: 'medium',
            });
            setSelectedImages([]);
          }
        }]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert(t('common.error'), 'Failed to submit report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('report.title')}</Text>
        <Text style={styles.subtitle}>{t('report.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        {/* Issue Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.issueTitle')} *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of the issue"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.category')} *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  formData.category === category.id && styles.categoryButtonActive,
                  { borderColor: category.color },
                ]}
                onPress={() => setFormData({ ...formData, category: category.id })}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === category.id && { color: category.color },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.priority')}</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  styles.priorityButton,
                  formData.priority === priority.id && styles.priorityButtonActive,
                  { backgroundColor: formData.priority === priority.id ? priority.color : '#F9FAFB' },
                ]}
                onPress={() => setFormData({ ...formData, priority: priority.id })}
              >
                <Text
                  style={[
                    styles.priorityText,
                    formData.priority === priority.id && styles.priorityTextActive,
                  ]}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.description')} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide more details about the issue..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.location')}</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Enter location or use current location"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <MapPin size={20} color="#1E40AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('report.addMedia')}</Text>
          <View style={styles.mediaContainer}>
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Camera size={24} color="#1E40AF" />
              <Text style={styles.mediaButtonText}>{t('report.takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <Upload size={24} color="#1E40AF" />
              <Text style={styles.mediaButtonText}>{t('report.uploadFiles')}</Text>
            </TouchableOpacity>
          </View>

          {selectedImages.length > 0 && (
            <ScrollView horizontal style={styles.imagePreview} showsHorizontalScrollIndicator={false}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={submitReport}
          disabled={loading}
        >
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? t('common.loading') : t('report.submitReport')}
          </Text>
        </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#F0F9FF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#1E40AF',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
  },
  imagePreview: {
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});