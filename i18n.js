/*
    i18n

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

// @namespace com.subnodal.i18n
namespace("com.subnodal.i18n", function(exports) {
    /*
        @name textDirections
        @type const <{*}>
        Enum for text directions.
    */
    /*
        @name textDirections.LTR
        @type const <*>
        Left-to-right text direction.
    */
    /*
        @name textDirections.RTL
        @type const <*>
        Right-to-left text direction.
    */
    exports.textDirections = {
        LTR: 0,
        RTL: 1
    };

    /*
        @name TranslationError
        @type class extends (global):Error
        An error that is thrown when a string could not be translated.
    */
    exports.TranslationError = class extends Error {
        constructor(message) {
            super(message);

            this.name = "TranslationError";
        }
    };

    /*
        @name TranslationString
        @type class
        A single translation string that is stored in a `Locale`.
    */
    /*
        @name TranslationString.chooser
        @type prop <Function>
        A function that returns a chosen translation string depending on the arguments object passed to it in the first parameter
    */
    exports.TranslationString = class {
        constructor() {
            this.chooser = function() {
                return "";
            };
        }

        /*
            @name TranslationString.simple
            @type static method
            Generate a simple `TranslationString` instance from a given string.
            @param string <String> The string to generate the `TranslationString` from
            @returns <TranslationString> The generated `TranslationString` instance
        */
        static simple(string) {
            var simpleTranslationString = new exports.TranslationString();

            simpleTranslationString.chooser = function() {
                return string;
            };

            return simpleTranslationString;
        }

        /*
            @name TranslationString.substitutive
            @type static method
            Generate a substitutive `TranslationString` instance from a given
            string with substitutive arguments.
            @param string <String> The string to generate the `TranslationString` from
            @returns <TranslationString> The generated `TranslationString` instance
        */
        static substitutive(string) {
            var substitutiveTranslationString = new exports.TranslationString();

            substitutiveTranslationString = function(args) {
                var substitutedString = String(string);

                for (var arg in args) {
                   substitutedString = substitutedString.split("{" + arg + "}").join(args[arg]);
                }

                return substitutedString;
            };

            return substitutiveTranslationString;
        }

        /*
            @name TranslationString.conditional
            @type static method
            Generate a conditional substitutive `TranslationString` instance
            from a given lookup object with conditions as keys and substitutive
            strings as values.
            @param lookup <{String}> The lookup object to generate the `TranslationString` from
            @returns <TranslationString> The generated `TranslationString` instance
        */
        static conditional(lookup) {
            var conditionalTranslationString = new exports.TranslationString();

            conditionalTranslationString = function(args) {
                for (var condition in lookup) {
                    var substitutedCondition = String(condition);

                    for (var arg in args) {
                        substitutedCondition = substitutedCondition.split("{" + arg + "}").join(args[arg]);
                    }

                    if (eval(substitutedCondition)) {
                        var substitutedString = lookup[condition];

                        for (var arg in args) {
                           substitutedString = substitutedString.split("{" + arg + "}").join(args[arg]);
                        }

                        return substitutedString;
                    }
                }

                return undefined;
            };
        }
    };

    /*
        @name Locale
        @type class
        A locale which holds string translation information as well as other
        cultural data.
        @param code <String> Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code 
        @param name <String> Human-readable full name of locale, such as `"English (United Kingdom)"`
        @param nameShort <String | null = null> Short version of Locale's name, such as `"English"`. If `null`, then `name` will be used
        @param textDirection <textDirections.* = textDirections.LTR> Directionality of rendered text in this locale
    */
    /*
        @name Locale.code
        @type prop <String>
    */
    /*
        @name Locale.name
        @type prop <String>
    */
    /*
        @name Locale.nameShort
        @type prop <String>
    */
    /*
        @name Locale.textDirection
        @type prop <textDirections.*>
    */
    /*
        @name Locale.strings
        @type prop <{TranslationString>}>
        Object of translation string keys and their associated `TranslationString` instances as values
    */
    exports.Locale = class {
        constructor(code, name, nameShort = null, textDirection = exports.textDirection.LTR) {
            this.code = code;
            this.name = name;
            this.nameShort = nameShort || this.name;
            this.textDirection = textDirection;

            this.strings = {};
        }
    };

    /*
        @name I18n
        @type class
        Internationalisation management class to be used for translating
        strings and holding multiple locales.
        @param localeCode <String> Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code
        @param fallbackLocaleCode <String> Code of locale to use when translations for the current locale are not available, following same format as `localeCode`
    */
    /*
        @name I18n.localeCode
        @type prop <String>
    */
    /*
        @name I18n.fallbackLocaleCode
        @type prop <String>
    */
    /*
        @name I18n.locales
        @type prop <[Locale]>
        A list of locales to be used for translating strings
    */
    exports.I18n = class {
        constructor(localeCode, fallbackLocaleCode = "en_GB") {
            this.localeCode = localeCode;
            this.fallbackLocaleCode = fallbackLocaleCode;
            this.locales = [];
        }

        /*
            @name I18n.getLocale
            Get a `Locale` object from the given locale code
            @param localeCode <String | null = null> Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code. If `null`, then `I18n.localeCode` will be used
            @returns <Locale | undefined> `Locale` object, or `undefined` if the specified locale could not be found
        */
        getLocale(localeCode = null) {
            localeCode = localeCode || this.localeCode;

            for (var i = 0; i < this.locales.length; i++) {
                if (this.locales[i].code == localeCode) {
                    return this.locales[i];
                }
            }

            return undefined;
        }

        /*
            @name I18n.formatValue
            Format a given value into a form appropriate for the given locale code
            @param data <*> Data value to format
            @param options <{String} = {}> A list of options to use when formatting the value
            @param localeCode <String | null = null> Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code. If `null`, then `I18n.localeCode` will be used
        */
        formatValue(data, options = {}, localeCode = null) {
            localeCode = localeCode || this.localeCode;

            if (typeof(data) == "number") {
                return Number(data).toLocaleString(localeCode.replace(/_/g, "-"), options);
            } else if (data instanceof Date) {
                return data.toLocaleString(localeCode.replace(/_/g, "-"), options);
            } else {
                return data;
            }
        }

        /*
            @name I18n.translate
            @type method
            Translate a given string into the current locale with respect to the
            supplied arguments.
            @param string <String> String to translate into current locale
            @param arguments <*> List of arguments to apply in translation. Can either be an `Array` or `Object`, but if another datatype is supplied, it will be used as argument `0`
            @param formatValues <Boolean = true> Whether to format arguments such as numbers or dates into the specified locale
            @param formatValueOptions <{String}> A list of options to use when formatting the arguments
        */
        translate(string, arguments = [], formatValues = true, formatValueOptions = {}) {
            if (typeof(arguments) != "object") {
                arguments = [arguments];
            }

            var stringTranslation = null;

            if (this.getLocale() != undefined && this.getLocale().strings[string] != undefined) {
                stringTranslation = this.getLocale().strings[string];
            } else if (this.getLocale(this.fallbackLocaleCode) != undefined && this.getLocale(this.fallbackLocaleCode).strings[string] != undefined) {
                stringTranslation = this.getLocale(this.fallbackLocaleCode).strings[string];
            } else {
                throw new exports.TranslationError("Tried to use fallback locale, but fallback locale does not exist");
            }

            if (formatValues) {
                for (var argument in arguments) {
                    arguments[argument] = this.formatValue(arguments[argument], formatValueOptions);
                }
            }

            return stringTranslation.chooser(arguments);
        }
    };
});
// @endnamespace