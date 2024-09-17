// modules/notifications.js
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "../init.js";

export async function getUserNotifications(userId) {
  const q = query(collection(db, 'notifications'), where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  const notifications = [];
  snapshot.forEach(doc => {
    notifications.push(doc.data());
  });
  return notifications;
}
