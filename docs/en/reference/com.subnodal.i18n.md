# com.subnodal.i18n
## 🎛️ `I18n`
`class` · Internationalisation management class to be used for translating strings and holding multiple locales.

**Parameters:**
* **`localeCode`** (`String`): Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code
* **`fallbackLocaleCode`** (`String`): Code of locale to use when translations for the current locale are not available, following same format as `localeCode`

## 🔡️ `I18n.fallbackLocaleCode`
`prop <String>`

## ▶️ `I18n.formatValue`
`function` · Format a given value into a form appropriate for the given locale code

**Parameters:**
* **`data`** (`*`): Data value to format
* **`options`** (`{String}` = `{}`): A list of options to use when formatting the value
* **`localeCode`** (`String | null` = `null`): Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code. If `null`, then `I18n.localeCode` will be used

## ▶️ `I18n.getLocale`
`function` · Get a `Locale` object from the given locale code

**Parameters:**
* **`localeCode`** (`String | null` = `null`): Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code. If `null`, then `I18n.localeCode` will be used

**Returns:** `Locale | undefined` · `Locale` object, or `undefined` if the specified locale could not be found

## 🔡️ `I18n.localeCode`
`prop <String>`

## 🔡️ `I18n.locales`
`prop <[Locale]>` · A list of locales to be used for translating strings

## ⏩️ `I18n.translate`
`method` · Translate a given string into the current locale with respect to the supplied arguments.

**Parameters:**
* **`string`** (`String`): String to translate into current locale
* **`arguments`** (`*`): List of arguments to apply in translation. Can either be an `Array` or `Object`, but if another datatype is supplied, it will be used as argument `0`
* **`formatValues`** (`Boolean` = `true`): Whether to format arguments such as numbers or dates into the specified locale
* **`formatValueOptions`** (`{String}`): A list of options to use when formatting the arguments

## 🎛️ `Locale`
`class` · A locale which holds string translation information as well as other cultural data.

**Parameters:**
* **`code`** (`String`): Locale code in the format `ll_RR` where `ll` is two-letter language code and `RR` is two-letter region code
* **`name`** (`String`): Human-readable full name of locale, such as `"English (United Kingdom)"`
* **`nameShort`** (`String | null` = `null`): Short version of Locale's name, such as `"English"`. If `null`, then `name` will be used
* **`textDirection`** (`textDirections.*` = `textDirections.LTR`): Directionality of rendered text in this locale

## 🔡️ `Locale.code`
`prop <String>`

## 🔡️ `Locale.name`
`prop <String>`

## 🔡️ `Locale.nameShort`
`prop <String>`

## 🔡️ `Locale.strings`
`prop <{TranslationString>}>` · Object of translation string keys and their associated `TranslationString` instances as values

## 🔡️ `Locale.textDirection`
`prop <textDirections.*>`

## 🎛️ `TranslationError`
`class extends (global):Error` · An error that is thrown when a string could not be translated.

## 🎛️ `TranslationString`
`class` · A single translation string that is stored in a `Locale`.

## 🔡️ `TranslationString.chooser`
`prop <Function>` · A function that returns a chosen translation string depending on the arguments object passed to it in the first parameter

## ❄️️ `TranslationString.conditional`
`static method` · Generate a conditional substitutive `TranslationString` instance from a given lookup object with conditions as keys and substitutive strings as values.

**Parameters:**
* **`lookup`** (`{String}`): The lookup object to generate the `TranslationString` from

**Returns:** `TranslationString` · The generated `TranslationString` instance

## ❄️️ `TranslationString.simple`
`static method` · Generate a simple `TranslationString` instance from a given string.

**Parameters:**
* **`string`** (`String`): The string to generate the `TranslationString` from

**Returns:** `TranslationString` · The generated `TranslationString` instance

## ❄️️ `TranslationString.substitutive`
`static method` · Generate a substitutive `TranslationString` instance from a given string with substitutive arguments.

**Parameters:**
* **`string`** (`String`): The string to generate the `TranslationString` from

**Returns:** `TranslationString` · The generated `TranslationString` instance

## 🔒️ `textDirections`
`const <{*}>` · Enum for text directions.

## 🔒️ `textDirections.LTR`
`const <*>` · Left-to-right text direction.

## 🔒️ `textDirections.RTL`
`const <*>` · Right-to-left text direction.