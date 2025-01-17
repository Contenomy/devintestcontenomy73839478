import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

import { Locale, format as formatDate, isDate } from 'date-fns';
import { it } from 'date-fns/locale';

const locales: {
    [key: string]: Locale
} = {
    it
};

i18next
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        lng: "it",
        ns: ["translation", "number", "datetime"],
        debug: process.env.NODE_ENV === "development",
        interpolation: {
            escapeValue: false,
            // format: function (value, format, locale) {
            //     if (isDate(value)) {
            //         return formatDate(value, format!, { locale: locales[locale!] })
            //     }
            //     return value;
            // }
        },
        backend: {
            ns: ["translation", "number"]
        }
    })