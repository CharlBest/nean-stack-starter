
export abstract class BaseRepository {

    query: Queries;
    fileExtension = 'cyp';

    constructor() {
        this.getQueries();
    }

    async getQueries() {
        this.query = {
            general: {
                createNewsletterMember: (await import(`../../database/general/createNewsletterMember.${this.fileExtension}`)).data,
                deleteNewsletterMember: (await import(`../../database/general/deleteNewsletterMember.${this.fileExtension}`)).data,
                paymentRequest: (await import(`../../database/general/paymentRequest.${this.fileExtension}`)).data
            },
            users: {
                addForgottenPasswordCode: (await import(`../../database/users/addForgottenPasswordCode.${this.fileExtension}`)).data,
                changeForgottenPassword: (await import(`../../database/users/changeForgottenPassword.${this.fileExtension}`)).data,
                createUser: (await import(`../../database/users/createUser.${this.fileExtension}`)).data,
                doesUserHavePermissions: (await import(`../../database/users/doesUserHavePermissions.${this.fileExtension}`)).data,
                doesUsernameAndEmailExist: (await import(`../../database/users/doesUsernameAndEmailExist.${this.fileExtension}`)).data,
                getUser: (await import(`../../database/users/getUser.${this.fileExtension}`)).data,
                getUserById: (await import(`../../database/users/getUserById.${this.fileExtension}`)).data,
                verifyEmail: (await import(`../../database/users/verifyEmail.${this.fileExtension}`)).data,
                updateAvatar: (await import(`../../database/users/updateAvatar.${this.fileExtension}`)).data,
                updateBio: (await import(`../../database/users/updateBio.${this.fileExtension}`)).data,
                updatePassword: (await import(`../../database/users/updatePassword.${this.fileExtension}`)).data,
                deleteUser: (await import(`../../database/users/deleteUser.${this.fileExtension}`)).data,
                completedTutorial: (await import(`../../database/users/completedTutorial.${this.fileExtension}`)).data
            }
        };
    }
}

interface Queries {
    general: {
        createNewsletterMember,
        deleteNewsletterMember,
        paymentRequest
    };

    users: {
        addForgottenPasswordCode,
        changeForgottenPassword,
        createUser,
        doesUserHavePermissions,
        doesUsernameAndEmailExist,
        getUser,
        getUserById,
        verifyEmail,
        updateAvatar,
        updateBio,
        updatePassword,
        deleteUser,
        completedTutorial
    };
}
