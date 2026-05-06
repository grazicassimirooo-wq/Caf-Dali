// ──────────────────────────────────────────────────────────────────────────────
//  Firebase Configuration — Dali Café
//
//  COMO CONFIGURAR:
//  1. Acesse https://console.firebase.google.com
//  2. Crie um projeto (ou selecione o existente)
//  3. Ative Authentication → Sign-in method → Email/senha
//  4. Ative Firestore Database (modo produção)
//  5. Vá em Project Settings → General → Your apps → Web app
//  6. Copie as chaves e substitua os valores abaixo
//  7. No Firestore, adicione as regras de segurança:
//
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      match /dali-content/{doc} {
//        allow read: if true;
//        allow write: if request.auth != null;
//      }
//    }
//  }
// ──────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            "AIzaSyA8zNLvZN68bnoZXhxWWootvvLLCMBDPhM",
  authDomain:        "dali-caf.firebaseapp.com",
  projectId:         "dali-caf",
  storageBucket:     "dali-caf.firebasestorage.app",
  messagingSenderId: "571361531987",
  appId:             "1:571361531987:web:561e13f39aff3c29770ea6"
};

window.FIREBASE_CONFIGURED = !firebaseConfig.apiKey.startsWith('YOUR_');

if (window.FIREBASE_CONFIGURED) {
  try {
    firebase.initializeApp(firebaseConfig);
    window.fbAuth      = firebase.auth();
    window.fbDb        = firebase.firestore();
    window.CONTENT_DOC = window.fbDb.collection('dali-content').doc('site-data');
  } catch (e) {
    window.FIREBASE_CONFIGURED = false;
    console.warn('[Dali] Firebase init failed:', e.message);
  }
}
