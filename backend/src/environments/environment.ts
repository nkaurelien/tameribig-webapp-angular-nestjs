const firebaseConfig = {
    apiKey: 'AIzaSyC6ruvmbR5zrOhfXjdosvFwzja4jmamTpY',
    authDomain: 'tameri-big.firebaseapp.com',
    databaseURL: 'https://tameri-big.firebaseio.com',
    projectId: 'tameri-big',
    storageBucket: 'tameri-big.appspot.com',
    messagingSenderId: '145742938489',
    appId: '1:145742938489:web:e693913dca4177fb',
};

export const environment = {
    authTokenKey: 'auth',
    isMockEnabled: false,
    production: false,
    firebaseConfig,
    MONGODB_URI: 'mongodb://localhost:27017/tameribig',
};
