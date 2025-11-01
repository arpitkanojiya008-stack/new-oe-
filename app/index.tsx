import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Search, Star, Download, Crown, Cpu } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { sensiData } from '@/mocks/sensiData';
import { SensiSettings, RamVariant } from '@/types/sensi';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedRam, setSelectedRam] = useState<Record<string, number>>({});

  const filteredData = useMemo(() => {
    let filtered = sensiData;

    if (selectedTab === 'free') {
      filtered = filtered.filter((item) => !item.isPremium);
    } else if (selectedTab === 'premium') {
      filtered = filtered.filter((item) => item.isPremium);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.deviceBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.processor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedTab]);

  const getRamVariant = (item: SensiSettings): RamVariant => {
    const selectedIndex = selectedRam[item.id] || 0;
    return item.ramVariants[selectedIndex];
  };

  const renderSensiCard = ({ item }: { item: SensiSettings }) => {
    const currentRamVariant = getRamVariant(item);
    const selectedIndex = selectedRam[item.id] || 0;

    return (
      <TouchableOpacity style={[styles.card, item.isPremium && styles.premiumCard]} activeOpacity={0.7}>
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Crown size={12} color={Colors.premium} />
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{item.deviceName}</Text>
            <Text style={styles.deviceBrand}>{item.deviceBrand}</Text>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{item.updateVersion}</Text>
          </View>
        </View>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Processor</Text>
            <Text style={styles.specValue}>{item.processor}</Text>
          </View>
        </View>

        <View style={styles.ramSelectorContainer}>
          <View style={styles.ramLabel}>
            <Cpu size={14} color={Colors.textSecondary} />
            <Text style={styles.ramLabelText}>RAM Configuration:</Text>
          </View>
          <View style={styles.ramButtons}>
            {item.ramVariants.map((variant, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.ramButton, selectedIndex === index && styles.ramButtonActive]}
                onPress={() => setSelectedRam((prev) => ({ ...prev, [item.id]: index }))}
              >
                <Text
                  style={[styles.ramButtonText, selectedIndex === index && styles.ramButtonTextActive]}
                >
                  {variant.ram}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sensiGrid}>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>General</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.general}</Text>
          </View>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>Red Dot</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.redDot}</Text>
          </View>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>2x Scope</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.twoX}</Text>
          </View>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>4x Scope</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.fourX}</Text>
          </View>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>AWM</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.awm}</Text>
          </View>
          <View style={styles.sensiItem}>
            <Text style={styles.sensiLabel}>Free Look</Text>
            <Text style={styles.sensiValue}>{currentRamVariant.freeLook}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <View style={styles.stat}>
              <Download size={14} color={Colors.textSecondary} />
              <Text style={styles.statText}>{item.downloads.toLocaleString()}</Text>
            </View>
          </View>
          {item.isPremium && item.price && (
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Free Fire Sensi</Text>
        <Text style={styles.headerSubtitle}>OB51 Updated • Max Sensi 200</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search device, brand, processor..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All Devices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'free' && styles.tabActive]}
          onPress={() => setSelectedTab('free')}
        >
          <Text style={[styles.tabText, selectedTab === 'free' && styles.tabTextActive]}>
            Free
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'premium' && styles.tabActive]}
          onPress={() => setSelectedTab('premium')}
        >
          <Text style={[styles.tabText, selectedTab === 'premium' && styles.tabTextActive]}>
            Premium
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderSensiCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  premiumCard: {
    borderColor: Colors.premium,
    borderWidth: 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.premium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 80,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  deviceBrand: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  versionBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500' as const,
  },
  specValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  ramSelectorContainer: {
    marginBottom: 16,
  },
  ramLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ramLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  ramButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ramButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ramButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ramButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  ramButtonTextActive: {
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  sensiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  sensiItem: {
    width: '30%',
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sensiLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500' as const,
  },
  sensiValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  priceTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
