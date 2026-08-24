import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Services from './Services'
import { useDispatch, useSelector } from 'react-redux'
import { setisAuthenticated } from '../../redux/authSlice'
import { colors } from '../../constants/colors'

/**
 * Design tokens
 * — Ink: near-black banner + primary text, reads as "official ID card" rather than a chat bubble
 * — Brand: existing app accent, reused for consistency across screens
 * — Verified/Pending/Rejected: status-mapped, not decorative
 */
const COLORS = {
    ink: '#14171F',
    inkMuted: 'rgba(255,255,255,0.6)',
    paper: '#F5F6F8',
    card: '#FFFFFF',
    brand: '#FA4A0C',
    brandTint: '#FFF1EA',
    text: '#14171F',
    subtext: '#7A7F8A',
    divider: '#EDEEF1',
    verified: '#1DA765',
    verifiedTint: '#E8F8EF',
    pending: '#C77C02',
    pendingTint: '#FFF4E0',
    rejected: '#D3392F',
    rejectedTint: '#FDEAE9',
    online: '#1DA765',
    offline: '#9AA0A6',
}

const DEFAULT_AVATAR = 'https://img.favpng.com/17/24/10/computer-icons-user-profile-male-avatar-png-favpng-jhVtWQQbMdbcNCahLZztCF5wk.jpg'

const STATUS_MAP = {
    approved: { label: 'Verified', color: COLORS.verified, tint: COLORS.verifiedTint, icon: 'check-decagram' },
    waiting: { label: 'Pending review', color: COLORS.pending, tint: COLORS.pendingTint, icon: 'clock-outline' },
    rejected: { label: 'Action needed', color: COLORS.rejected, tint: COLORS.rejectedTint, icon: 'alert-circle-outline' },
}

const maskAccountNumber = (accNo) => {
    if (!accNo) return 'N/A';
    const last4 = accNo.slice(-4);
    return `•••• •••• ${last4}`;
}

const Profile = ({user}) => {


    // if (!user) {
    //     return (
    //         <View style={styles.screen}>
    //             <View style={styles.loadingBanner} />
    //             <Text style={styles.loadingText}>Loading your profile…</Text>
    //         </View>
    //     )
    // }

    return (
        <View style={styles.screen}>
            <ProfileHeader user={user} />
            <StatsRow user={user} />
            <DetailSection
                title="Contact & vehicle"
                rows={[
                    { icon: 'phone-outline', label: 'Mobile number', value: user?.phone_no },
                    { icon: 'moped', label: 'Vehicle number', value: user?.vehicle_no },
                    { icon: 'card-account-details-outline', label: 'Registration no.', value: user?.registration_no },
                ]}
            />
            <DetailSection
                title="Bank details"
                rows={[
                    { icon: 'bank-outline', label: 'Bank name', value: user?.bank_name },
                    { icon: 'credit-card-outline', label: 'Account number', value: maskAccountNumber(user?.account_no) },
                    { icon: 'identifier', label: 'IFSC code', value: user?.IFSC_code },
                ]}
            />
            <Services />
        </View>
    )
}

export default Profile

function ProfileHeader({ user }) {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'N/A';
    const status = STATUS_MAP[user?.approved] ?? STATUS_MAP.waiting;
    const isOnline = user?.status === 'online';

    return (
        <View>
            <View style={styles.banner}>
                <Text style={styles.bannerTitle}>Profile</Text>
                {/* <Text style={styles.bannerSubtitle}>Delivery partner ID</Text> */}
            </View>

            <View style={styles.identityCard}>
                <View style={styles.avatarWrap}>
                    <Image
                        source={{ uri:  DEFAULT_AVATAR }}
                        style={styles.avatar}
                    />
                    <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.online : COLORS.offline }]} />
                </View>

                <Text style={styles.name}>{fullName}</Text>
                <Text style={styles.idText}>Partner ID · {user?.id ?? 'N/A'}</Text>

                <View style={[styles.statusPill, { backgroundColor: status.tint }]}>
                    <MaterialCommunityIcons name={status.icon} size={14} color={status.color} />
                    <Text style={[styles.statusPillText, { color: status.color }]}>{status?.label}</Text>
                </View>
            </View>
        </View>
    )
}

function StatsRow({ user }) {
    const stats = [
        { icon: 'star-outline', label: 'Rating', value: 'New' },
        { icon: 'moped', label: 'Vehicle', value: user?.vehicle_type ? user?.vehicle_type.toUpperCase() : 'N/A' },
        { icon: 'briefcase-outline', label: 'Work type', value: user?.work_type ? user.work_type.replace('_', ' ') : 'N/A' },
    ]

    return (
        <View style={styles.statsRow}>
            {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name={stat.icon} size={20} color={colors.primary} />
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                    {index < stats.length - 1 && <View style={styles.statDivider} />}
                </React.Fragment>
            ))}
        </View>
    )
}

function DetailSection({ title, rows }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>
                {rows.map((row, index) => (
                    <View key={row.label}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconWrap}>
                                <MaterialCommunityIcons name={row.icon} size={18} color={colors.primary} />
                            </View>
                            <View style={styles.detailTextWrap}>
                                <Text style={styles.detailLabel}>{row.label}</Text>
                                <Text style={styles.detailValue}>{row.value || 'N/A'}</Text>
                            </View>
                        </View>
                        {index < rows.length - 1 && <View style={styles.rowDivider} />}
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.paper,
    
    },
    loadingBanner: {
        height: 140,
        backgroundColor: COLORS.ink,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 24,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.subtext,
        fontSize: 14,
    },
    banner: {
        backgroundColor: colors.greenLight,
        paddingTop: 50,
        paddingBottom: 64,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 24,
    },
    bannerTitle: {
        fontSize: 22,
        fontFamily: 'OpenSans-Bold',
        color: colors.text,
        letterSpacing: 0.3,
    },
    bannerSubtitle: {
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.inkMuted,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    identityCard: {
        backgroundColor: COLORS.card,
        marginHorizontal: 20,
        marginTop: -48,
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    avatarWrap: {
        marginTop: -52,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 4,
        borderColor: COLORS.card,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.card,
    },
    name: {
        fontSize: 19,
        fontFamily: 'OpenSans-Bold',
        color: COLORS.text,
        marginTop: 12,
    },
    idText: {
        fontSize: 13,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.subtext,
        marginTop: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 12,
    },
    statusPillText: {
        fontSize: 12,
        fontFamily: 'OpenSans-Medium',
        letterSpacing: 0.3,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.divider,
    },
    statValue: {
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
        color: COLORS.text,
        marginTop: 6,
        textTransform: 'capitalize',
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.subtext,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    section: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'OpenSans-Medium',
        color: COLORS.subtext,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    detailIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: colors.greenLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailTextWrap: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        fontFamily: 'OpenSans-Regular',
        color: COLORS.subtext,
    },
    detailValue: {
        fontSize: 15,
        fontFamily: 'OpenSans-Medium',
        color: COLORS.text,
        marginTop: 2,
    },
    rowDivider: {
        height: 1,
        backgroundColor: COLORS.divider,
    },
})