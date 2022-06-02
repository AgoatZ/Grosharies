export const UserDummy = {
    firstName: "Dummy",
    lastName: "User",
    emailAddress: "email@email.com",
    password: "",
    phone: "050000000",
    accountType: "user",
    rank: 0,
    posts: [],
    profileImage: "",
    source: "grosharies",
    collectedHistory: []
}

export const PostDummy = {
    _id: 0,
    headline: "Post Headline",
    userId: 1,
    address: "5 King George, Tel Aviv",
    addressCoordinates: { lat: 32.0705882, lng: 34.7711982 },
    publishingDate: Date.now,
    pickUpDates: [{ from: Date.now, until: Date.now }],
    status: "still there",
    tags: [],
    content: [],
    description: "Post Description",
    images: [],
    videos: [],
    observers: [],
    repliers: []
}