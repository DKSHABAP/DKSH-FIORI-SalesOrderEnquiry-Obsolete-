jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([], function () {
	"use strict";
	return {
		dateFormatter: function (pTimeStamp) {
			if (pTimeStamp === undefined) {
				return;
			}
			var a = new Date(pTimeStamp);
			var dateFormat = a.toLocaleDateString();
			return dateFormat;
			// var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 	pattern: "dd/MM/YYYY"
			// });
			// return dateFormat.format(new Date(pTimeStamp));
		},
		dateFormatterGetSeconds: function (value) {
			if (value)
				return value.split(".")[0];
			return "";
		},

		keyValueformat: function (key, value) {
			if (key !== "") {
				if (value !== "" && value !== null) {
					return " (" + key + ")" + value;
				} else {
					return key;
				}
			} else {
				return key;
			}

		},

		keyValuePairFormat: function (key, value) {
			if (key !== "" && key !== null) {
				if (value !== "" && value !== null) {
					return key + " " + "-" + " " + value;
				} else {
					return key;
				}
			} else {
				if (value !== "" && value !== null) {
					return value;
				} else {
					return "";
				}
			}

		},

		bpmFormatter: function (value) {
			switch (value) {
			case "WE":
				return "SHIP TO";
			case "RE":
				return "BILL TO";
			case "RG":
				return "PAYER";
			case "AG":
				return "SOLD TO";
			}
		},
		getLength: function (value) {
			if (value && value.length > 0)
				return " (" + value.length + ")";
			return "";
		}

	};
});