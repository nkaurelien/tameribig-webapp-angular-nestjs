export const jwtConstants = {
    secret: '32B239CAF4021EAE3EF0BBFDCCE995325AE73B28', // sha1
};

const idRegex = '([0-9a-f]{24})';
export const AuthRoutesToken = {
    root: 'auth',
    someUser: 'user/:uid',
    someUserAlt: 'profile/:uid',
};
