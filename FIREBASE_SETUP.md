# LetterMatter - Backend with Firebase

This project is integrated with Firebase for authentication, database, and storage services.

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Get your Firebase configuration from the project settings
3. Update the `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Firebase Services Used

- **Authentication**: For user registration and login
- **Firestore Database**: For storing user data, letters, therapists, etc.
- **Storage**: For storing media attachments (images, audio, etc.)

## Collections Structure (Firestore)

- `users`: Stores user profiles and information
- `therapists`: Stores therapist profiles and verification status
- `letters`: Stores the letters created by users
- `administrators`: Stores admin information for managing the platform

## Security Rules (Firestore)

Make sure to set up proper security rules in your Firebase project:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para a coleção de terapeutas
    match /therapists/{therapistId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == therapistId;
    }
    
    // Regras para a coleção de cartas
    match /letters/{letterId} {
      // Permitir leitura apenas para o autor da carta
      allow read: if request.auth != null && request.auth.uid == resource.data.author_id;
      // Permitir criação: o autor deve ser o usuário autenticado
      allow create: if request.auth != null && request.auth.uid == request.resource.data.author_id;
      // Permitir atualização: o autor deve ser o usuário autenticado (verificando o documento existente)
      allow update: if request.auth != null && request.auth.uid == resource.data.author_id;
      // Permitir exclusão apenas para o autor da carta
      allow delete: if request.auth != null && request.auth.uid == resource.data.author_id;
    }
    
    // Convites só podem ser acessados pelo paciente ou terapeuta envolvidos
    match /invitations/{invitationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.patientId || 
         request.auth.uid == resource.data.therapistId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.therapistId;
    }
    
    // Regras para a coleção de escritas na biblioteca
    match /library_writings/{writingId} {
      // Permitir leitura apenas para o autor da escrita
      allow read: if request.auth != null && request.auth.uid == resource.data.author_id;
      // Permitir criação: o autor deve ser o usuário autenticado
      allow create: if request.auth != null && request.auth.uid == request.resource.data.author_id;
      // Permitir atualização: o autor deve ser o usuário autenticado
      allow update: if request.auth != null && request.auth.uid == resource.data.author_id;
      // Permitir exclusão apenas para o autor da escrita
      allow delete: if request.auth != null && request.auth.uid == resource.data.author_id;
    }
  }
}
```

**Importante:** Após fazer as alterações no código, certifique-se de que as regras acima estejam exatamente como especificado no Console do Firebase Firestore em "Rules". As regras devem estar em: Firestore Database > Rules.

## Development

To run the project locally:

```bash
npm install
npm run dev
```

## Key Features Implemented

1. **Authentication**: Email/password and Google authentication for both patients and therapists
2. **User Profiles**: Firestore-based user profiles with role management
3. **Secure Routing**: Protected routes based on authentication status
4. **Therapist Linking**: Patients can link to therapists using a unique code
5. **Data Encryption**: Proper security rules to protect sensitive data

## Project Structure

```
src/
├── firebase/
│   ├── config.js          # Firebase configuration
│   ├── auth.js           # Authentication exports
│   ├── firestore.js      # Firestore exports
│   ├── storage.js        # Storage exports
│   ├── authService.js    # Authentication service functions
│   ├── firestoreService.js # Firestore service functions
│   └── userProfileService.js # User profile service functions
├── composables/
│   └── useAuthStore.js   # Authentication store
```