import { initializeApp } from 'firebase/app';
import {updateProfile ,signInWithEmailAndPassword,  initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import config from '../firebase.json';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";

const app = initializeApp(config);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export const login = async ({ email, password }) => {
  const { user }
    = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const logout = async () => {
  return await auth.signOut();
};

const uploadImage = async uri => {
    const blob = await new Promise((resolve, reject ) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const user = auth.currentUser;
    const storage = getStorage(app);
    const sref = ref(storage, `/profile/${user.uid}/photo.png`);
    await uploadBytes(sref, blob, { contentType: 'image/png' });

    blob.close();
    return await getDownloadURL(sref);
};

export const signup = async ({ email, password, name, photoUrl }) => {
    const { user }= await createUserWithEmailAndPassword(auth, email, password);
      const storageUrl = photoUrl.startsWith('https')
      ? photoUrl
      : await uploadImage(photoUrl);
    await updateProfile(auth.currentUser,{
        displayName: name,
        photoURL: storageUrl,
    });
    return user;
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL} = auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async photoUrl => {
  const user = auth.currentUser;
  const storageUrl = photoUrl.startsWith('https')
  ? photoUrl
  : await uploadImage(photoUrl);
  await updateProfile(user, { photoURL: storageUrl });
  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

export const db = getFirestore(app);

export const createChannel = async ({ title, description }) => {
  const channelCollection = collection(db, 'channels');
  const newChannelRef = doc(channelCollection);
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

export const createMessage = async ({ channelId, text }) => {
  const messageCollection = collection(db, `channels/${channelId}/messages`);
  const newMessageRef = doc(messageCollection, text._id);
  const newMessage = {
    ...text,
    createdAt: Date.now(),
  };
  await setDoc(newMessageRef, newMessage);
  }
  /*
  const messageCollection = collection(db, `channels/${channelId}/messages`);
  const newMessageRef = doc(messageCollection);
  const id = text.id;
  const newMessage = {
    id,
    text,
    createdAt: Date.now(),
  };
  await setDoc(newMessageRef, newMessage);
  }
  */