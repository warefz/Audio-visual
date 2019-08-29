
(function (root, factory) {
    if (typeof define === 'function') {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.ERRORCODE = factory();
    }
}(this, function () {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {

        SUCCESS: 0,
        /*
         * auth error
         * */
        AUTHENTICATION_FAILED : 100,

        AUTHURIZATION_FAILED : 101,

        WRONG_AUTHCODE : 102,

        WRONG_SMS_CODE : 103,

        WRONG_USERNAME_OR_PASSWORD: 104,

        /*
         * params error
         * */

        PARAMETER_INVALID: 201,

        INVALID_RESULT:202,

        /*
         * Logic error
         */
        CREATE_FAILED: 401,

        QUERY_FAILED: 402,

        UPDATE_FAILED: 403,

        ENROLL_FAILED: 404,

        VERIFY_FAILED: 405,

        SEND_SMS_FAILED: 406,

        CHANGE_PASSWORD_FAILED: 407,

        LOGOUT_FAILED:408,

        AMOUNT_ERROR:409,

        ACCOUNT_ERROR:410,

        LOW_BALANCE:411,

        RECHARGE_FAILED:412,

        ACTIVE_FAILED:413,

        BUILD_FAILED:414,

        USERNAME_HAS_BEEN_TAKEN:415,

        SEND_SMS_TOO_QUICKLY:416,

        DOWNLOAD_TOO_MANY_TIMES:417,

        DOWNLOAD_FAILED:418,

        /*
         * system error
         * */
        SYSTEM_BUSY: 501


        /*
         USER_NOT_FOUND: 1,

         WRONG_PASSWORD: 2,

         WRONG_PARAM: 3,

         AUTH_FAILED: 4,

         TIMESTAMP_EXPIRED: 5,

         WRONG_AUTHCODE: 6,

         LOGIN_FAILED: 7,

         STORE_NOT_FOUND: 8,

         LOGIN_STATUS_ERROR: 9,

         UPLOAD_IMG_FAILED: 10,

         CREATE_ITEM_FAILED: 11,

         PATIALLY_SUCCESS: 12,

         STORE_NOT_EXIST: 13,

         USER_NOT_EXIST: 14,

         //PASSWORD_ERROR: 15,

         UPDATE_ITEM_FAILED: 16,

         DELETE_ITEM_FAILED: 17,

         ITEM_NOT_EXIST: 18,

         QUERY_FAILED: 19,

         ITEM_DUPLICATED: 20,

         USER_NOT_ALLOWED: 21,

         NETWORK_BUSY: 22,

         CDKEY_NOT_FOUND: 23,

         CDKEY_ALREADY_USERD: 24,

         UPLOAD_FAILED: 25
         */
    };
}));