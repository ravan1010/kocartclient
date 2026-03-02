importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey : import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('firebase notification :', payload)
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});