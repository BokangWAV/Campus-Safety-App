const { appendNotifications } = require('./notification.js');
const { db, FieldValue } = require('./init.js');


function isEveningEvent(eventTime) {
    const eventDate = new Date(eventTime); 
    const eventHour = eventDate.getHours(); 
    return eventHour >= 18; 
}


async function processEvent(event) {
    
    const severity = (event.capacity - event.availableTickets) / event.capacity;

    
    let riskLevel = 'Safe';
    let safetyGuideline = 'Enjoy the event and follow standard safety measures.';


    const isEvening = isEveningEvent(event.time);

    if (severity >= 0.65 && isEvening) {
        riskLevel = 'Take Precaution';
        safetyGuideline = 'Stay in groups, avoid dark areas, and be aware of your surroundings.';
    } else if (severity >= 0.65) {
        riskLevel = 'Be Cautious';
        safetyGuideline = 'Stay vigilant and avoid overcrowded areas.';
    } else if (severity >= 0.3 && isEvening) {
        riskLevel = 'Stay Alert';
        safetyGuideline = 'Stay alert, especially in less crowded or darker areas.';
    } else if (severity >= 0.3) {
        riskLevel = 'Moderate Caution';
        safetyGuideline = 'Be mindful of your surroundings, but enjoy the event.';
    } else if (isEvening) {
        riskLevel = 'Stay Alert';
        safetyGuideline = 'Stick with friends and stay aware of your surroundings.';
    } else {
        riskLevel = 'Safe';
        safetyGuideline = 'Enjoy the event, but always practice general safety.';
    }

  
    try {
        const eventRef = db.collection('events');
        await eventRef.add({
            eventName: event.name,
            capacity: event.capacity,
            availableTickets: event.availableTickets,
            location: event.location,
            imageUrl: event.imageUrl,
            riskLevel: riskLevel,
            safetyGuideline: safetyGuideline,
            eventTime: event.time,
            timestamp: FieldValue.serverTimestamp(),
        });
        console.log('Event successfully added to Firestore with risk level:', riskLevel);
    } catch (error) {
        console.error('Error adding event to Firestore:', error);
        return { success: false, message: 'Error adding event to Firestore' };
    }

  
    try {
        const usersRef = db.collection('users');
        const idArray = [];

      
        await usersRef.get().then((snapshot) => {
            if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                    idArray.push(doc.id);
                });
            }
        });

        
        const user2 = {
            firstName: 'Campus Safety Team',
            lastName: '',
            profilePicture: 'https://firebasestorage.googleapis.com/v0/b/tdkus-fcf53.appspot.com/o/profilePicture%2FcampusSafety.webp?alt=media',
        };

       
        const message = `Event: ${event.name} at ${event.location}, on ${event.time}. Risk level: ${riskLevel}. ${safetyGuideline}`;
        appendNotifications(idArray, message, user2, 'safety alert', event.location, event.imageUrl);

        console.log('Notifications successfully sent to users');
        return { success: true, message: 'Event processed and notifications sent' };
    } catch (error) {
        console.error('Error sending notifications:', error);
        return { success: false, message: 'Error sending notifications' };
    }
}

module.exports = { processEvent };
