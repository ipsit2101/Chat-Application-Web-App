
export function getNameInitials(name) {

    const splitName = name.toUpperCase().split(' ');
    if (splitName.length > 1) {
        return splitName[0][0] + splitName[0][1];
    }
    return splitName[0][0];
}

export function TransformToArray(snapshotVal) {
    return snapshotVal ? Object.keys(snapshotVal).map((roomId) => {
        return {
            ...snapshotVal[roomId],
            id: roomId
        }
    }) : [];
}

export async function getUserUpdates(userId, keyUpdate, value, db) {
    const updates = {};

    updates[`/profiles/${userId}/${keyUpdate}`] = value;
    const getMsgs = db.ref('/messages').orderByChild('author/uid').equalTo(userId).once('value');
    const getRooms = db.ref('/rooms').orderByChild('/lastMessage/author/uid').equalTo(userId).once('value');

    const [msgSnpshot, roomSnapshot] = await Promise.all([getMsgs, getRooms]);

    msgSnpshot.forEach(msgSnap => {
        updates[`/messages/${msgSnap.key}/author/${keyUpdate}`] = value;
    });

    roomSnapshot.forEach(roomSnap => {
        updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyUpdate}`] = value;
    });

    return updates;
}

// transforming Object to an Array
export function TransformObjectToArray(snapVal) {

    return snapVal ? Object.keys(snapVal) : [];   
}     

export function groupBy(array, groupingKeyFunc) {
    return array.reduce((result, item) => {    // The reduce method calls the call-back function one time for each element in the array.
        const groupingKey = groupingKeyFunc(item);

        if (!result[groupingKey]) {
           result[groupingKey] = [];
        }

        result[groupingKey].push(item);
        return result;

    }, {})  
}