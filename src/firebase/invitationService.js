import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  setDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './init';

// Invitations collection
const invitationsCollection = 'invitations';

// Create a new invitation for a patient to link with a therapist
const createInvitation = async (invitationData) => {
  try {
    const invitationRef = doc(db, invitationsCollection, invitationData.id);
    await setDoc(invitationRef, {
      ...invitationData,
      status: 'pending', // Default status
      createdAt: serverTimestamp(),
      expiresAt: invitationData.expiresAt || null // Optional expiration date
    });
    return invitationRef;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

// Get invitation by ID
const getInvitationById = async (invitationId) => {
  try {
    const invitationDoc = doc(db, invitationsCollection, invitationId);
    const invitationSnapshot = await getDoc(invitationDoc);
    return invitationSnapshot.exists() ? { id: invitationSnapshot.id, ...invitationSnapshot.data() } : null;
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw error;
  }
};

// Get invitations by patient ID (for patient to see their invitations)
const getInvitationsByPatientId = async (patientId) => {
  try {
    const q = query(
      collection(db, invitationsCollection), 
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting invitations by patient ID:', error);
    throw error;
  }
};

// Get invitations by therapist ID (for therapist to see sent invitations)
const getInvitationsByTherapistId = async (therapistId) => {
  try {
    const q = query(
      collection(db, invitationsCollection), 
      where('therapistId', '==', therapistId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting invitations by therapist ID:', error);
    throw error;
  }
};

// Update invitation status (accept, decline, etc.)
const updateInvitationStatus = async (invitationId, status, additionalData = {}) => {
  try {
    const invitationDoc = doc(db, invitationsCollection, invitationId);
    await updateDoc(invitationDoc, {
      status: status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
  } catch (error) {
    console.error('Error updating invitation status:', error);
    throw error;
  }
};

// Accept an invitation and link patient to therapist
const acceptInvitation = async (invitationId, patientId) => {
  try {
    // Get the invitation details
    const invitation = await getInvitationById(invitationId);
    if (!invitation || invitation.status !== 'pending') {
      throw new Error('Convite inválido ou já processado');
    }

    // Update the invitation status to accepted
    await updateInvitationStatus(invitationId, 'accepted');

    // Link the patient to the therapist
    // Import linkToTherapist function from userProfileService
    const { linkToTherapist } = await import('./userProfileService.js');
    await linkToTherapist(invitation.therapistId);

    return invitation;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

// Decline an invitation
const declineInvitation = async (invitationId) => {
  try {
    await updateInvitationStatus(invitationId, 'declined');
  } catch (error) {
    console.error('Error declining invitation:', error);
    throw error;
  }
};

// Check if a patient has pending invitations
const hasPendingInvitations = async (patientId) => {
  try {
    const q = query(
      collection(db, invitationsCollection), 
      where('patientId', '==', patientId),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking pending invitations:', error);
    throw error;
  }
};

export {
  invitationsCollection,
  createInvitation,
  getInvitationById,
  getInvitationsByPatientId,
  getInvitationsByTherapistId,
  updateInvitationStatus,
  acceptInvitation,
  declineInvitation,
  hasPendingInvitations
};