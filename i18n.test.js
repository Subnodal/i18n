/*
    i18n

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

namespace("com.subnodal.i18n.test", function(exports) {
    var subTest = require("com.subnodal.subtest");
    var i18n = require("com.subnodal.i18n");

    var translationStringSimple = new subTest.Test(function() {
        var translationString = i18n.TranslationString.simple("Hello, world!");

        return translationString.chooser();
    }).shouldEqual("Hello, world!");

    var translationStringSubstitutive = new subTest.Test(function() {
        var translationString = i18n.TranslationString.substitutive("Hello, {name}! You have one new message from {sender} for {name}.");

        return translationString.chooser({name: "Alice", sender: "Bob"});
    }).shouldEqual("Hello, Alice! You have one new message from Bob for Alice.").after(translationStringSimple);

    var translationStringConditional = new subTest.Test(function() {
        var translationString = i18n.TranslationString.conditional({
            "{0} == 0": "You have no new messages",
            "{0} == 1": "You have 1 new message",
            "{0} > 1": "You have {0} new messages"
        });

        return (
            translationString.chooser([0], [0]) == "You have no new messages" &&
            translationString.chooser([1], [1]) == "You have 1 new message" &&
            translationString.chooser([2], [2]) == "You have 2 new messages"
        );
    }).shouldEqual().after(translationStringSimple);

    var initLocale = new subTest.Test(function() {
        var locale = new i18n.Locale("en_GB", "English (United Kingdom)");

        locale.strings["test"] = i18n.TranslationString.simple("Hello, world!");

        return locale.strings["test"].chooser();
    }).shouldEqual("Hello, world!").after(translationStringSimple);

    var localeFromJsonData = new subTest.Test(function() {
        var locale = i18n.Locale.fromJson("be_GB", {
            "name": "Backwards English (United Kingdom)",
            "nameShort": "Backwards English",
            "textDirection": "rtl",
            "strings": {}
        });

        return (
            locale.code == "be_GB" &&
            locale.name == "Backwards English (United Kingdom)" &&
            locale.nameShort == "Backwards English" &&
            locale.textDirection == i18n.textDirections.RTL
        );
    }).shouldEqual().after(initLocale);

    var localeFromJsonSimple = new subTest.Test(function() {
        var locale = i18n.Locale.fromJson("be_GB", {
            "name": "Backwards English (United Kingdom)",
            "nameShort": "Backwards English",
            "textDirection": "rtl",
            "strings": {
                "hello": "!olleH"
            }
        });

        return locale.strings["hello"].chooser();
    }).shouldEqual("!olleH").after(localeFromJsonData);

    var localeFromJsonSubstitutional = new subTest.Test(function() {
        var locale = i18n.Locale.fromJson("be_GB", {
            "name": "Backwards English (United Kingdom)",
            "nameShort": "Backwards English",
            "textDirection": "rtl",
            "strings": {
                "hello": "!olleH",
                "name": "{name} si eman ruoY"
            }
        });

        return locale.strings["name"].chooser({name: "Alice"});
    }).shouldEqual("Alice si eman ruoY").after(localeFromJsonSimple);

    var localeFromJsonConditional = new subTest.Test(function() {
        var locale = i18n.Locale.fromJson("be_GB", {
            "name": "Backwards English (United Kingdom)",
            "nameShort": "Backwards English",
            "textDirection": "rtl",
            "strings": {
                "hello": "!olleH",
                "name": "{name} si eman ruoY",
                "items": {
                    "{0} == 1": ".meti 1 evah uoY",
                    "{0} > 1": ".smeti {0} evah uoY"
                }
            }
        });

        return (
            locale.strings["items"].chooser([1], [1]) == ".meti 1 evah uoY" &&
            locale.strings["items"].chooser([2], [2]) == ".smeti 2 evah uoY"
        );
    }).shouldEqual().after(localeFromJsonSimple);

    var getLocale = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        i18nInstance.locales[0] = new i18n.Locale("en_GB", "English (United Kingdom)", "English", i18n.textDirections.LTR);

        return i18nInstance.getLocale() == i18nInstance.locales[0];
    }).shouldEqual().after(initLocale);

    var formatValueNumeric = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        return i18nInstance.formatValue(123456.78);
    }).shouldEqual("123,456.78").after(getLocale);

    var formatValueDate = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        return i18nInstance.formatValue(new Date(1609459200000));
    }).shouldEqual("01/01/2021, 00:00:00").after(getLocale);

    var translateSimple = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        i18nInstance.locales[0] = new i18n.Locale("en_GB", "English (United Kingdom)", "English", i18n.textDirections.LTR);
        i18nInstance.locales[0].strings["test"] = i18n.TranslationString.simple("Hello, world!");

        return i18nInstance.translate("test");
    }).shouldEqual("Hello, world!").after(getLocale);

    var translateSubstitutive = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        i18nInstance.locales[0] = new i18n.Locale("en_GB", "English (United Kingdom)", "English", i18n.textDirections.LTR);
        i18nInstance.locales[0].strings["test"] = i18n.TranslationString.substitutive("Hello, {name}!");

        return i18nInstance.translate("test", {"name": "Alice"});
    }).shouldEqual("Hello, Alice!").after(translateSimple);

    var translateConditional = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        i18nInstance.locales[0] = new i18n.Locale("en_GB", "English (United Kingdom)", "English", i18n.textDirections.LTR);
        i18nInstance.locales[0].strings["test"] = i18n.TranslationString.conditional({
            "{0} == 0": "You have no new messages",
            "{0} == 1": "You have 1 new message",
            "{0} > 1": "You have {0} new messages"
        });

        return (
            i18nInstance.translate("test", [0]) == "You have no new messages" &&
            i18nInstance.translate("test", [1]) == "You have 1 new message" &&
            i18nInstance.translate("test", [2]) == "You have 2 new messages"
        );
    }).shouldEqual().after(translateSimple);

    var translateFormatted = new subTest.Test(function() {
        var i18nInstance = new i18n.I18n("en_GB");

        i18nInstance.locales[0] = new i18n.Locale("en_GB", "English (United Kingdom)", "English", i18n.textDirections.LTR);
        i18nInstance.locales[0].strings["test"] = i18n.TranslationString.substitutive("You have {tokens} tokens, first created at {date}");

        return i18nInstance.translate("test", {"tokens": 123456.78, "date": new Date(1609459200000)});
    }).shouldEqual("You have 123,456.78 tokens, first created at 01/01/2021, 00:00:00").after(translateConditional);

    exports.tests = {
        translationStringSimple,
        translationStringSubstitutive,
        translationStringConditional,
        initLocale,
        localeFromJsonData,
        localeFromJsonSimple,
        localeFromJsonSubstitutional,
        localeFromJsonConditional,
        getLocale,
        formatValueNumeric,
        formatValueDate,
        translateSimple,
        translateSubstitutive,
        translateConditional,
        translateFormatted
    };
});