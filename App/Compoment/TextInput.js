import React from 'react';
import { Text, View, } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import { Container, Header, Content, Input, Item, Label } from 'native-base';
import { TextInput } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { validationempty } from '../Common/Validations';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const fontConfig = {
    web: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'sans-serif-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'sans-serif-thin',
            fontWeight: 'normal',
        },
    },
    ios: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Poppins-Regular',
            fontWeight: 'normal',
        },
    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
    colors: {

        placeholder: Colors.lightblack,
        text: Colors.black,
        primary: Colors.TheamColor2,
    },
};

const CustomTextInput = props => {
    const {
        style,
        onChangeText,
        onFocus,
        returnKeyType,
        placeholder,
        value,
        success,
        secureTextEntry,
        keyboardType,
        multiline,
        textAlignVertical,
        iconName,
        iconType,
        onSubmitEditing,
        editable,
        title,
        maxLength,
        numberOfLines,
        ref,
        caretHidden,
        iconPress,
        ...attrs
    } = props;


    return (
        <View style={[style, {  }]}>

            <TextInput
                ref={ref}
                caretHidden={caretHidden}
                onSubmitEditing={onSubmitEditing}
                style={{ backgroundColor: Colors.white, width: '100%', fontSize: 14, }}
                mode='outlined'
                label={validationempty(title) ? title : ''}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                editable={editable}
                numberOfLines={numberOfLines}
                returnKeyType={validationempty(returnKeyType) ? returnKeyType : ''}
                placeholder={validationempty(placeholder) ? placeholder : ''}
                secureTextEntry={secureTextEntry}
                maxLength={maxLength}
                keyboardType={keyboardType}
                theme={theme}

                right={validationempty(iconName) ? <TextInput.Icon name={iconName} onPress={iconPress} color={Colors.lightblack} />
                    : null}
                // right={<TextInput.Icon name={iconName} onPress={iconPress} color={Colors.TheamColor4} />}
                attrs
            >
            </TextInput>
        </View >
    );
}

export default CustomTextInput;
