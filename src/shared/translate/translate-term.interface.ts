export interface TranslateTerm {
    everythingOnThisDemoSite: string;
    noItemsExist: string;
    signup: string;
    login: string;
    yourItems: string;
    yourSubscriptions: string;
    yourSaved: string;
    profile: string;
    notificationPreferences: string;
    donate: string;
    feedback: string;
    inviteFriends: string;
    newsletter: string;
    takeTour: string;
    help: string;
    developer: string;
    logout: string;
    nightMode: string;
    dayMode: string;
    triggerBroadcast: string;
    noMessages: string;
    helloFromSomewhere: string;
    sent: string;
    newItemsAvailable: string;
    fetch: string;
    newSignUpJustNow: string;
    helloToYouToo: string;
    language: string;
}

export type TranslateKey = keyof TranslateTerm;
