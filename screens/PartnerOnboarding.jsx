import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import apiService from '../services/ApiService'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import PendingDoc from '../components/info/PendingDoc'
import CompletedDoc from '../components/info/CompletedDocs'
import { setisAuthenticated, setUser } from '../redux/authSlice'
import SuccessModal from '../components/common/DynamicModal'
import OnboardingHeader from '../components/common/Header'
import ButtonComp from '../components/common/ButtonComp'
import { colors } from '../constants/colors'

const GREEN_DARK = '#4F7A63'

// Small "● Section title" label used above both document lists.
const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
)

const PartnerOnboarding = () => {
    const [successModal, setSuccessModal] = useState(false);
    const [pending, setPending] = useState([]);
    const [approved, setApproved] = useState([]);
    const [checkingProfile, setCheckingProfile] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigation = useNavigation()


  
    const handleNext = async () => {
        if (pending.length !== 0) {
            Alert.alert("You have pending documents to upload. Please complete the required documents before proceeding.")
            return;
        }
        setSuccessModal(true); 

        // try {
        //     setCheckingProfile(true);
        //     const res = await apiService('/api/deliveryBoy/getme', 'GET', null, {
        //         Authorization: `Bearer ${token}`,
        //     });

        //     if (res.error) {
        //         console.log(res);
        //         Alert.alert("Something went wrong while fetching your profile. Please try again.");
        //         return;
        //     }

        //     console.log("Profile:", res)
        //     dispatch(setUser(res?.data?.data));
            
        // } catch (error) {
        //     console.log("Error fetching profile:", error);
        //     Alert.alert("Something went wrong while fetching your profile. Please try again.");
        // } finally {
        //     setCheckingProfile(false);
        // }
    }

    const GetInfo = async () => {
        try {
            const res = await apiService('/api/deliveryBoy/getDocsStatus', 'GET', null, {
                Authorization: `Bearer ${token}`,
            });
            console.log("res", res.data.data);
            setPending(res.data.data.pendingDocuments);
            setApproved(res.data.data.completedDocuments);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    useFocusEffect(
        useCallback(() => {
            GetInfo();
        }, [])
    )

    return (
        <View style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

            <OnboardingHeader
                title="Welcome to Food Cart"
                subtitle="Just a few more steps will help you finish creating your profile and begin making money."
                icon="bag-outline"
                showBack={false}
            />
                <View style={styles.section}>
                    <SectionHeader title="Pending Documents" />
                    <View style={styles.listWrap}>
                        {pending.length === 0 ? (
                            <Text style={styles.emptyText}>No pending documents</Text>
                        ) : (
                            pending.map((doc, index) => (
                                <PendingDoc
                                    key={index}
                                    title={doc}
                                    href={doc.toLowerCase().replace(/ /g, "-")}
                                />
                            ))
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <SectionHeader title="Completed Documents" />
                    <View style={styles.listWrap}>
                        {approved.length === 0 ? (
                            <Text style={styles.emptyText}>No completed documents yet</Text>
                        ) : (
                            approved.map((doc, index) => (
                                <CompletedDoc key={index} title={doc} href={doc.toLowerCase().replace(/ /g, "-")} navigation={navigation} />
                            ))
                        )}
                    </View>
                </View>

              
                  <ButtonComp
            title="Continue"
            onPress={handleNext}
            bg={colors.primary}
            color="#fff"
            size={16}
            fw="700"
            ff="OpenSans-Bold"
            ta="center"
            height={54}
            // loading={checkingProfile}
            mt={20}
          />
            </ScrollView>
            <SuccessModal visible={successModal} setVisible={setSuccessModal} message={'Your documents have been successfully uploaded'} onClose={() => dispatch(setisAuthenticated(true))} />
        </View>
    )
}

export default PartnerOnboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal:16
    },
    section: {
        paddingTop: 24,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: GREEN_DARK,
        marginRight: 8,
    },
    sectionHeaderText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        color: '#1A1A1A',
    },
    listWrap: {},
    emptyText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        paddingVertical: 8,
    },
    continueButton: {
        backgroundColor: GREEN_DARK,
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 16,
        marginHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
    },
})