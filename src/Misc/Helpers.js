
export function getNameInitials(name) {

    const splitName = name.toUpperCase().split(' ');
    if (splitName.length > 1) {
        return splitName[0][0] + splitName[0][1];
    }
    return splitName[0][0];
}