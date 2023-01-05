// sap.ui.define([
// 	"sap/ui/core/mvc/Controller"
// ], function (Controller) {
// 	"use strict";

// 	return Controller.extend("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.controller.ManageRetExch", {

// 		/**
// 		 * Called when a controller is instantiated and its View controls (if available) are already created.
// 		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
// 		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ManageRetExch
// 		 */
// 		onInit: function () {

// 		},
// 		onNavigateToDetail: function(oEvent){
			
// 		}

// 		/**
// 		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
// 		 * (NOT before the first rendering! onInit() is used for that one!).
// 		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ManageRetExch
// 		 */
// 		//	onBeforeRendering: function() {
// 		//
// 		//	},

// 		/**
// 		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
// 		 * This hook is the same one that SAPUI5 controls get after being rendered.
// 		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ManageRetExch
// 		 */
// 		//	onAfterRendering: function() {
// 		//
// 		//	},

// 		/**
// 		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
// 		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ManageRetExch
// 		 */
// 		//	onExit: function() {
// 		//
// 		//	}

// 	});

// });

sap.ui.define([
	"sap/ui/core/mvc/Controller",
//	"dksh/connectclient/connectclientsalesorderenquiry/model/formatter",
    "../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, formatter, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.controller.ReturnsDetail", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.com.cherrywork.ReturnsMgmt.view.ReturnsDetail
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this.onRouteMatched, this);
			// this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			var dataModel = sap.ui.getCore().getModel("oGlobalModel");
			if (oEvent.getParameter("arguments").index) {
				this.selectedObjects = [];
				var index = oEvent.getParameter("arguments").index;
				var oTableModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oTableModel, "oTableModel");
				oTableModel.setProperty("/data", dataModel.getData().results[index]);
				//Document Flow
				var oDocFlowModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oDocFlowModel, "oDocFlowModel");
				if (oTableModel.getData().data.HeaderToItemNav.results.length > 0) {
					var array = oTableModel.getData().data.HeaderToItemNav.results;
					var newArray = [];
					var uniqueObject = {};
					for (i in array) {
						var objTitle = array[i]['deliveryNum'];
						uniqueObject[objTitle] = array[i];
					}
					for (i in uniqueObject) {
						newArray.push(uniqueObject[i]);
					}
					for (var j = 0; j < newArray.length; j++) {
						if (!newArray[j].deliveryNum)
							newArray.splice(j, 1);
					}
					oDocFlowModel.getData().results = newArray;
					// oDocFlowModel.getData().results = oTableModel.getData().data.HeaderToItemNav.results;
					oDocFlowModel.refresh();
				}
				//items
				var oitemsModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oitemsModel, "oitemsModel");
				oitemsModel.getData().results = oTableModel.getData().data.HeaderToItemNav.results;
				for (var i = 0; i < oitemsModel.getData().results.length; i++) {
					if (oitemsModel.getData().results[i].b2bStatus)
						oitemsModel.getData().results[i].b2bstatus = oitemsModel.getData().results[i].b2bStatus.split("@");
				}
				oitemsModel.refresh();
				//Buisness Partners
				var oBMModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oBMModel, "oBMModel");
				oBMModel.getData().array = oTableModel.getData().data.HeaderToPartnersNav.results;
				// oBMModel.getData().array = [];
				// oBMModel.getData().array.push({
				// 	"role": "Bill To",
				// 	"id": dataModel.getData().results[index].HeaderToPartnersNav.results[0].billTo,
				// 	"name": dataModel.getData().results[index].HeaderToPartnersNav.results[0].billToName,
				// 	"address": dataModel.getData().results[index].HeaderToPartnersNav.results[0].address
				// });
				// oBMModel.getData().array.push({
				// 	"role": "Payer",
				// 	"id": dataModel.getData().results[index].HeaderToPartnersNav.results[0].payer,
				// 	"name": dataModel.getData().results[index].HeaderToPartnersNav.results[0].payerName,
				// 	"address": dataModel.getData().results[index].HeaderToPartnersNav.results[0].address
				// });
				// oBMModel.getData().array.push({
				// 	"role": "Ship To",
				// 	"id": dataModel.getData().results[index].HeaderToPartnersNav.results[0].shipTo,
				// 	"name": dataModel.getData().results[index].HeaderToPartnersNav.results[0].shipToName,
				// 	"address": dataModel.getData().results[index].HeaderToPartnersNav.results[0].address
				// });
				oBMModel.refresh();
				this.getUserDetails();
			}
		},
		getUserDetails: function () {
			var that = this;
			$.ajax({
				type: "GET",
				async: false,
				url: "/services/userapi/currentUser",
				contentType: "application/scim+json",
				success: function (data, textStatus, xhr) {
					var userModel = new sap.ui.model.json.JSONModel(data);
					that.getView().setModel(userModel, "userapi");
					var PersonalizationModel = new sap.ui.model.json.JSONModel();
					that.getView().setModel(PersonalizationModel, "PersonalizationModel");
					that._getPersonalizationDetails();
				},
				error: function (data) {
					sap.m.MessageBox.error(that.getView().getModel("i18n").getProperty("retrieveDetails"));
				}
			});
		},
		personalizationInvDetails: function (oEvent) {
			if (!this.FilterPersonalization) {
				// this.FilterPersonalization = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.fragments.Personalization",
				 this.FilterPersonalization = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.Personalization",
					this);
				this.getView().addDependent(this.FilterPersonalization);
			}
			this._getPersonalizationDetails();
			this.FilterPersonalization.open();
		},
		_getPersonalizationDetails: function () {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			that.getView().setModel(oModel, "oModel");
			var screen = "Web";
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var payload = {
				"userId": this.getView().getModel("userapi").getProperty("/name"),
				"appId": "keySoEnquiry",
				"runType": screen,
				"emailId": this.getView().getModel("userapi").getData().email
			};
			oModel.loadData("/DKSHJavaService/variant/getVariant", JSON.stringify(payload), true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (success) {
				if (success.getSource().getData().userPersonaDto !== null) {
					that.getView().getModel("PersonalizationModel").setProperty("/personalizationInvoiceData", success.getSource().getData());
					var FilterPersonalization = new sap.ui.model.json.JSONModel({});
					FilterPersonalization.setData({
						"enableCheckBox": false,
						"selectVarVisible": true,
						"nameVarVisible": false,
						"okPersBtnVisible": true,
						"savePersBtnVisible": false,
						"cancelPersBtnVisible": true,
						"deletePersBtnVisible": false,
						"createPersBtnVisible": true,
						"varinatNameValueState": "None",
						"editPersBtnVisible": true,
						"results": success.getSource().getData()
					});
					if (that.FilterPersonalization) {
						that.FilterPersonalization.setModel(FilterPersonalization, "FilterPersonalization");
						that.FilterPersonalization.getModel("FilterPersonalization").refresh();
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/results/action", "");
					}
				} //Method to get Logged in user PID
			});
			oModel.attachRequestFailed(function (oEvent) {
				MessageBox.error(oEvent.getSource().getData().message);
			});
		},
		onVariantOK: function () {
			// var that = this;
			// var PersonalizationModel = this.getView().getModel("PersonalizationModel");
			// var FilterPersonalization = new sap.ui.model.json.JSONModel({
			// 	"results": this.getView().getModel("PersonalizationModel").getData()
			// });
			// this.FilterPersonalization.setModel(FilterPersonalization, "FilterPersonalization");
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/selectVarVisible", true);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/nameVarVisible", false);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/enableCheckBox", false);
			// this.FilterPersonalization.getModel("FilterPersonalization").refresh();
			// this.FilterPersonalization.getModel("FilterPersonalization").refresh();
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/okPersBtnVisible", true);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/savePersBtnVisible", false);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/cancelPersBtnVisible", true);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/deletePersBtnVisible", false);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/createPersBtnVisible", true);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/editPersBtnVisible", true);
			// this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/varinatNameValueState", "None");
			// this.selectedObjects = [];
			// this.getView().getModel("PersonalizationModel").refresh();
			this.FilterPersonalization.close();
		},
		onPersonlizationClose: function () {
			this.selectedObjects = [];
			this.FilterPersonalization.close();
		},
		onVariantCreate: function () {
			var PersonalizationModel = this.FilterPersonalization.getModel("FilterPersonalization");
			PersonalizationModel.setProperty("/results/action", "Create");
			PersonalizationModel.setProperty("/selectVarVisible", false);
			PersonalizationModel.setProperty("/nameVarVisible", true);
			PersonalizationModel.setProperty("/enableCheckBox", true);
			PersonalizationModel.setProperty("/okPersBtnVisible", false);
			PersonalizationModel.setProperty("/savePersBtnVisible", true);
			PersonalizationModel.setProperty("/newVariantName", "");
			var fieldData = PersonalizationModel.getData().results.userPersonaDto;
			for (var i = 0; i < fieldData.length; i++) {
				fieldData[i].status = false;
			}
			PersonalizationModel.setProperty("/results/userPersonaDto", fieldData);
			this.FilterPersonalization.getModel("FilterPersonalization").refresh();
		},
		onVariantSave: function (oEvent) {
			if (this.selectedObjects.length === 0) {
			MessageToast.show(this.getView().getModel("i18n").getProperty("saveAfterEdit"));
				return;
			}
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			var PersonalizationModel = this.FilterPersonalization.getModel("FilterPersonalization");
			if (PersonalizationModel.getProperty("/results/action") === "Create") {
				if (PersonalizationModel.getData().newVariantName !== undefined && PersonalizationModel.getData().newVariantName !==
					"") {
					for (var j = 0; j < PersonalizationModel.getData().results.variantName.length; j++) {
						if (PersonalizationModel.getData().results.variantName[j].name === PersonalizationModel.getData().newVariantName) {
							this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/varinatNameValueState", "Error");
							MessageBox.error(this.getView().getModel("i18n").getProperty("newVariant"));
							return;
						}
					}
					this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/varinatNameValueState", "None");
					var VariantName = PersonalizationModel.getData().newVariantName;
					for (var i = 0; i < this.selectedObjects.length; i++) {
						this.selectedObjects[i].variantId = VariantName;
					}

				} else {
					this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/varinatNameValueState", "Error");
					sap.m.MessageBox.error(this.getView().getModel("i18n").getProperty("enterVariant"));
					return;
				}
			}
			var payload = {
				"varaiantObject": this.selectedObjects,
				"userId": this.getView().getModel("userapi").getProperty("/name"),
				"applicationId": "keySoEnquiry",
				"varaintId": this.selectedObjects[0].variantId
			};
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			oModel.loadData("/DKSHJavaService/variant/UpdateVariant", JSON.stringify(payload), true, "PUT", false,
				false, oHeader);
			oModel.attachRequestCompleted(function (success) {
				busyDialog.close();
				that.selectedObjects = [];
				that.FilterPersonalization.close();
				sap.m.MessageBox.success(that.getView().getModel("i18n").getProperty("created"), {
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.OK) {
							that._getPersonalizationDetails(that.currentStep, "Before");
						}
					}
				});
			});
			oModel.attachRequestFailed(function (oEvent) {
				MessageBox.error(oEvent.getSource().getData().message);
			});
		},
		onChangeCheckbox: function (oEvent) {
			var personalizationData = this.FilterPersonalization.getModel("FilterPersonalization").getData().results.userPersonaDto;
			var path = parseInt(oEvent.getSource().getBindingContext("FilterPersonalization").getPath().split("/")[3]);
			if (oEvent.getSource().getSelected() === true) {
				for (var j = 0; j < personalizationData.length; j++) {
					if (j === path) {
						personalizationData[j].status = true;
					}
					if (this.FilterPersonalization.getModel("FilterPersonalization").getProperty("/results/action") === "Create") {
						personalizationData[j].id = "";
					}
					this.selectedObjects = personalizationData;
				}
			} else {
				for (var i = 0; i < personalizationData.length; i++) {
					if (i === path) {
						personalizationData[i].status = false;
					}
				}
				this.selectedObjects = personalizationData;
			}
		},
		onSelectvarian: function (oEvent) {
			var that = this;
			var pID = this.getView().getModel("userapi").getProperty("/name");
			var oModel = new sap.ui.model.json.JSONModel();
			that.getView().setModel(oModel, "oModel");
			// this.selectedTab = "keyInvoice";
			if (oEvent) {
				var varinatName = oEvent.getSource().getSelectedKey();
			} else {
				var varinatName = this.FilterPersonalization.getModel("FilterPersonalization").getData().results.currentVariant;
			}
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var screen = "Web";
			// if (sap.ui.Device.system.phone === true) {
			// 	screen = "Phone";
			// }
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			oModel.loadData("/DKSHJavaService/variant/getvariantLists/" + pID + "/keySoEnquiry/" + varinatName + "/" + screen,
				true,
				"POST", false,
				false, oHeader);
			oModel.attachRequestCompleted(function (success) {
				busyDialog.close();
				var success = success.getSource().getData().userPersonaDto;
				if (that.FilterPersonalization.getModel("FilterPersonalization").getProperty("/results/action") === "Edit") {
					that.getView().getModel("PersonalizationModel").setProperty("/personalizationInvoiceData/userPersonaDto", success);
					that.FilterPersonalization.getModel("FilterPersonalization").setProperty(
						"/results/userPersonaDto", success);
					that.FilterPersonalization.getModel("FilterPersonalization").refresh();
					that.getView().getModel("PersonalizationModel").refresh();
					if (that.FilterPersonalization.getModel("FilterPersonalization").getProperty(
							"/results/currentVariant") ===
						"Default") {
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/results/action", "");
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/enableCheckBox", false);
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/savePersBtnVisible", false);
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/okPersBtnVisible", true);
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/deletePersBtnVisible", false);
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/selectVarVisible", true);
						that.FilterPersonalization.getModel("FilterPersonalization").setProperty("/nameVarVisible", false);
						MessageToast.show(that.getView().getModel("i18n").getProperty("cannotEdit"));
						that.FilterPersonalization.getModel("FilterPersonalization").refresh();
					}
				} else {
					that.getView().getModel("PersonalizationModel").setProperty("/personalizationInvoiceData/userPersonaDto", success);
					that.FilterPersonalization.getModel("FilterPersonalization").setProperty(
						"/results/userPersonaDto", success);
					that.FilterPersonalization.getModel("FilterPersonalization").refresh();
					that.getView().getModel("PersonalizationModel").refresh();
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				MessageBox.error(oEvent.getSource().getData().message);
			});
		},

		onVariantEdit: function () {
			var PersonalizationModel = this.FilterPersonalization.getModel("FilterPersonalization");
			if (PersonalizationModel.getData().results.currentVariant === "Default") {
			MessageToast.show(this.getView().getModel("i18n").getProperty("cannotEdit"));
				return;
			}
			PersonalizationModel.setProperty("/results/action", "Edit");
			this.FilterPersonalization.getModel("FilterPersonalization").setProperty("/okPersBtnVisible", false);
			PersonalizationModel.setProperty("/enableCheckBox", true);
			PersonalizationModel.setProperty("/savePersBtnVisible", true);
			PersonalizationModel.setProperty("/deletePersBtnVisible", true);
			PersonalizationModel.setProperty("/selectVarVisible", true);
			PersonalizationModel.setProperty("/nameVarVisible", false);
			PersonalizationModel.refresh();
			this.onSelectvarian();
		},
		onVariantDelete: function () {
			var that = this;
			var data = this.FilterPersonalization.getModel("FilterPersonalization").getProperty("/results/userPersonaDto");
			var payload = {
				"userId": this.getView().getModel("userapi").getProperty("/name"),
				"applicationId": "keySoEnquiry",
				"varaiantObject": data,
				"varaintId": this.FilterPersonalization.getModel("FilterPersonalization").getProperty(
					"/results/userPersonaDto")[0].variantId
			};
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var oModel = new sap.ui.model.json.JSONModel();
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			oModel.loadData("/DKSHJavaService/variant/deleteVariant", JSON.stringify(payload), true, "DELETE", false,
				false, oHeader);
			oModel.attachRequestCompleted(function (success) {
				busyDialog.close();
				that.FilterPersonalization.close();
				// 	// var message = oNewEvent.getSource().getData().message;
				sap.m.MessageBox.success(success.getSource().getData().name, {
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.OK) {
							that._getPersonalizationDetails();
						}
					}
				});
			});
			oModel.attachRequestFailed(function (oEvent) {
				MessageBox.error(oEvent.getSource().getData().name);
			});
		}
	});

});