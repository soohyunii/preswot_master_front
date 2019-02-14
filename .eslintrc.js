module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "dblab-academy-front": "eslint:recommended",
    /*"extends": "dblab-academy-front",*/
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};