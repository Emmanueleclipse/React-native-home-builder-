import { showToast } from "./CommonMethods"
import { ToastAndroid, Picker, StyleSheet, SafeAreaView, View, Image, Text, FlatList, TouchableOpacity, Alert } from 'react-native';

const validationBlank = (value, msg) => {
    console.log('value --> ', value)
    if (value === '') {
        showToast(msg, 'error')
    } else if (value === null) {
        showToast(msg, 'error')
    } else if (value === undefined) {
        showToast(msg, 'error')
    } else if (value.length < 1) {
        showToast(msg, 'error')
    } else if (value === false) {
        showToast(msg, 'error')
    } else {
        return true
    }
}

const validateName = (value, length) => {

    if (length) {
        if (value === '') {
            showToast('Please enter Name', 'error')
        }
        else if (value.length <= length) {
            showToast('Name is to short', 'error')
        }
        else {
            return true
        }
    } else {
        if (value === '') {
            showToast('Please Enter Name', 'error')
        }
        else if (value.length <= 3) {
            showToast('Name is to short', 'error')
        }
        else {
            return true
        }
    }

}

const validationempty = (value) => {
    if (value === '') {
    } else if (value === undefined) {
    } else if (value === null) {
    } else if (value.length < 1) {
    } else if (value === 'null') {
    } else if (value === 'NULL') {
    } else if (value === NaN) {
    } else {
        return true
    }
}


const validateEmail = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(value).toLowerCase())) {
        return true
    } else if (value === '') {
        showToast('enter Email address', 'error')
    } else {
        showToast('enter valid Email address', 'error')
    }
}


const validatePhone = (value) => {

    if (value.length === 10) {
        return true
    } else if (value === '') {
        showToast('enter mobile number', 'error')
    } else {
        showToast('enter 10 digit mobile number', 'error')
    }
}
const validatePasswordLogin = (value, length) => {

    if (value.length === 0) {
        showToast('Please Enter Password', 'error')
    } else {
        return true
    }
}

const validatePassword = (value, length) => {
    var msg_1 = 'Password Must be at least of 8 Character,one special Character,one number'
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (value === '') {
        showToast('Please Enter Password', 'error')
    } else {
        if (!regularExpression.test(value)) {
            showToast(msg_1, 'error')
        }
        else {
            return true
        }
        // if (length) {
        //     if (value.length >= length) {
        //         return true
        //     } else {
        //         showToast(msg_1, 'error')
        //     }
        // } else {
        //     if (value.length >= 4) {
        //         return true
        //     } else {
        //         showToast(msg_1, 'error')
        //     }
        // }
    }
}

const validateOldPassword = (value, length) => {
    var msg_1 = 'Old Password Must Be 4 Character'

    if (value === '') {
        showToast('Please Enter Old Password', 'error')
    } else {
        if (length) {
            if (value.length >= length) {
                return true
            } else {
                showToast(msg_1, 'error')
            }
        } else {
            if (value.length >= 4) {
                return true
            } else {
                showToast(msg_1, 'error')
            }
        }
    }
}

const validateConfirmPassword = (value, length) => {
    var msg_1 = 'Confirm Password Must Be * Character '

    if (value === '') {
        showToast('Please Enter Confirm Password', 'error')
    } else {
        if (length) {
            if (value.length >= length) {
                return true
            } else {
                showToast(msg_1, 'error')
            }
        } else {
            if (value.length >= 6) {
                return true
            } else {
                showToast(msg_1, 'error')
            }
        }
    }
}

const matchPassword = (value1, value2) => {

    if (value1 === value2) {
        return true
    } else {
        showToast('Confirm password not match', 'error')
    }
}

export {
    validatePhone, validateEmail, validateName,
    validatePassword,validatePasswordLogin, validateConfirmPassword, matchPassword, validateOldPassword,
    validationBlank, validationempty
}