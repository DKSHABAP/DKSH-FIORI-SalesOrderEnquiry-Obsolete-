jQuery.sap.declare("incture.com.ConnectClientMatEnquiry.model.formatter");

incture.com.ConnectClientMatEnquiry.model.formatter = {
	dateFormatter: function (e) {
		if (!e)
			return "";
		e = new Date(e);
		if (e) {
			var t = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "dd.MM.yyyy HH:mm:ss"
			});
			if (e.getDate().toString().length === 1) {
				var r = "0" + e.getDate();
			} else {
				var r = e.getDate();
			}
			if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
				var n = "0" + (e.getMonth() + 1);
			} else {
				var n = e.getMonth() + 1;
			}
			if (e.getHours().toString().length === 1) {
				var a = "0" + e.getHours();
			} else {
				var a = e.getHours();
			}
			if (e.getMinutes().toString().length === 1) {
				var o = "0" + e.getMinutes();
			} else {
				var o = e.getMinutes();
			}
			if (e.getSeconds().toString().length === 1) {
				var g = "0" + e.getSeconds();
			} else {
				var g = e.getSeconds();
			}
			var r = e.getFullYear() + "-" + n + "-" + r;
			return t.format(e);
		} else {
			return "";
		}
	},
	dateDetailFormatter: function (e) {
		if (!e)
			return "";
		e = new Date(e);
		if (e) {
			var t = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "dd.MM.yyyy HH:mm:ss"
			});
			if (e.getDate().toString().length === 1) {
				var r = "0" + e.getDate();
			} else {
				var r = e.getDate();
			}
			if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
				var n = "0" + (e.getMonth() + 1);
			} else {
				var n = e.getMonth() + 1;
			}
			return r + "." + n + "." + e.getFullYear();
		} else {
			return "";
		}
	},
	expiryDateBind: function (val, val1) {
		if (val1) {
			var e = new Date(val1);
			if (e && e.getFullYear() != "9999") {
				if (e.getDate().toString().length === 1) {
					var r = "0" + e.getDate();
				} else {
					var r = e.getDate();
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var n = "0" + (e.getMonth() + 1);
				} else {
					var n = e.getMonth() + 1;
				}
				if (val)
					return val + "(" + r + "." + n + "." + e.getFullYear() + ")";
				return r + "." + n + "." + e.getFullYear();
			}
			return val;
		}
		return val;
	},

	f4ValueBind: function (val1, val2) {
		if (val1 && val2) {
			return val1 + " (" + val2 + ")";
		} else if (val1 && !val2) {
			return val1;
		} else if (!val1 && val2) {
			return val2;
		} else {
			return "";
		}
	},
	getLength: function (value) {
		if (value && value.length > 0)
			return " (" + value.length + ")";
		return "";
	},
	colorCode: function (so, dn, bn) {
		var id = this.getId();
		// var id = this.getParent().getId() + "_cell0";

		if (so && dn && bn)
			sap.ui.getCore().byId(id).addStyleClass("successColor");
		else if (so && dn || so && bn)
			sap.ui.getCore().byId(id).addStyleClass("warningColor");
		else
		// $("#" + id).addClass("errorColor");
			sap.ui.getCore().byId(id).addStyleClass("errorColor");
		return true;

	},
	colorState: function (so, dn, bn) {
		var oTable = sap.ui.getCore().byId("idRet1");
		if (oTable) {
			var oItems = oTable.getItems();
			var i = this.getId().split("-").pop();
			if (so && dn || so && bn)
				oItems[i].setHighlight("Warning");
			else if (so && dn && bn)
				oItems[i].setHighlight("Success");
			else
				oItems[i].setHighlight("Error");
		}
		return true;
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
	}
};