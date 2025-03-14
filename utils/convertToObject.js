// Function to solve issue 'Only plain objects can be passed to Client Components from Server Components. 
// Objects with toJSON methods are not supported. '

export function convertToSerializableObject(leanDocument) {
    // Check if each of the lean documents (=properties) that's passed in 
    // has toJSON() and toString() methods
    // If they do, then we want to set to string version
    // First, loop through them
    for (const key of Object.keys(leanDocument)) {
        if (leanDocument[key].toJSON && leanDocument[key].toString) {
            leanDocument[key] = leanDocument[key].toString();
        }
    }
    return leanDocument;
}