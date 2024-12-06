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
    production: true,
    isMockEnabled: false,
    firebaseConfig,
    MONGODB_URI:
        'mongodb://heroku_4p3ptdxw:4dvek87v9r96ilcvo1tpfe67tb@ds141621.mlab.com:41621/heroku_4p3ptdxw',
};
