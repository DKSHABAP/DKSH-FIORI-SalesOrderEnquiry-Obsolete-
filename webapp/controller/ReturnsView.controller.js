sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../model/formatter",
	"sap/ui/export/Spreadsheet"
], function (Controller, JSONModel, MessageToast, MessageBox, formatter, Spreadsheet) {
	"use strict";

	return Controller.extend("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.controller.ReturnsView", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ReturnsView
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this._onRouteMatched, this);
			var baseModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(baseModel, "baseModel");
			this.getView().getModel("baseModel").setProperty("/openVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", true);
			this.salesHdrData = {
				customerPo: "",
				SoldtoParty: "",
				SoldtoPartyDesc: "",
				DistChan: "",
				DistChanDesc: "",
				salesOrg: "",
				division: "",
				CustomerNo: "",
				shipToParty: "",
				headerDlvBlock: "",
				Reason: "",
				Description: "",
				orderNumber: "",
				materialGroup: "",
				materialGroupDesc: "",
				materialGroup4: "",
				materialGroup4Desc: "",
				poType: "",
				poTypeDesc: "",
				billingNumber: "",
				DMSNumber: "",
				startDate: new Date(),
				endDate: new Date(),
				loginInUserId: this.userID
			};
			this.SalesHdrModel = new sap.ui.model.json.JSONModel(this.salesHdrData);
			this.getView().setModel(this.SalesHdrModel, "SaleHdrModelSet");
			this.allAccess = true;
			this.getLoggedInUserDetail();
		},
		_onRouteMatched: function () {

		},
		getLoggedInUserDetail: function () {
			var userId;
			var thes = this;
			$.ajax({
				type: "GET",
				async: false,
				url: "/services/userapi/currentUser",
				contentType: "application/scim+json",
				success: function (data, textStatus, xhr) {

					var userModel = new sap.ui.model.json.JSONModel(data);
					thes.getView().setModel(userModel, "userapi");
					userId = thes.getView().getModel("userapi").getData().name;
					thes.userID = userId;
					thes.getLoggedInUserName(userId);
					thes.getAttributeDetails(userId);
				},
				error: function (data) {
					sap.m.MessageBox.error(thes.getView().getModel("i18n").getProperty("retrieveDetails"));
				},
				complete: function (data) {}
			});
			return userId;
		},
		getAttributeDetails: function (userId) {
			var that = this;
			$.ajax({
				type: "GET",
				async: false,
				url: "/DKSHJavaService/userDetails/findAllRightsForUserInDomain/" + userId + "&cc",
				contentType: "application/scim+json",
				success: function (data, textStatus, xhr) {
					if (data.message)
						that.allAccess = false;
					that.salesOrgDataAccess = data.ATR01;
					that.distrChannelDataAccess = data.ATR02;
					that.divisionDataAccess = data.ATR03;
					that.materialGroupDataAccess = data.ATR04;
					that.materialGroup4DataAccess = data.ATR05;
					that.custCodeDataAccess = data.ATR06;
					that.MaterialCodeDac = data.ATR07;
					that.orderTypeDataAccess = data.ATR08;
				},
				error: function (data) {
					that.salesOrgDataAccess = null;
					that.distrChannelDataAccess = null;
					that.divisionDataAccess = null;
					that.materialGroupDataAccess = null;
					that.materialGroup4DataAccess = null;
					that.custCodeDataAccess = null;
					that.MaterialCodeDac = null;
					that.orderTypeDataAccess = null;
					if (data.status == 409)
						that.allAccess = false;
					else
						sap.m.MessageBox.error(thes.getView().getModel("i18n").getProperty("retrieveDetails"));
				},
				complete: function (data) {}
			});
		},
		/*function to call scim service to get the user details*/
		getLoggedInUserName: function (userId) {
			var that = this;
			var oLoggedInUserDetailModel = new sap.ui.model.json.JSONModel();
			that.getView().setModel(oLoggedInUserDetailModel, "oLoggedInUserDetailModel");
			// Service to getLogged in User
			oLoggedInUserDetailModel.loadData("/IDPService/service/scim/Users/" + userId, null, true);
			oLoggedInUserDetailModel.attachRequestCompleted(function (oEvent) {
				// data access control
				// var custAttribute = oEvent.getSource().getData()["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"];
				// if (custAttribute.attributes[0] !== undefined) {
				// 	that.salesOrgDataAccess = custAttribute.attributes[0].value;
				// } else {
				// 	that.salesOrgDataAccess = "No Access";
				// }
				// if (custAttribute.attributes[2] !== undefined) {
				// 	that.distrChannelDataAccess = custAttribute.attributes[2].value;
				// } else {
				// 	that.distrChannelDataAccess = "No Access";

				// }
				// if (custAttribute.attributes[3] !== undefined) {
				// 	that.divisionDataAccess = custAttribute.attributes[3].value;
				// } else {
				// 	that.divisionDataAccess = "No Access";

				// }
				// if (custAttribute.attributes[4] !== undefined) {
				// 	that.materialGroupDataAccess = custAttribute.attributes[4].value;
				// } else {
				// 	that.materialGroupDataAccess = "No Access";

				// }
				// if (custAttribute.attributes[5] !== undefined) {
				// 	that.materialGroup4DataAccess = custAttribute.attributes[5].value;
				// } else {
				// 	that.materialGroup4DataAccess = "No Access";

				// }
				// if (custAttribute.attributes[6] !== undefined) {
				// 	that.custCodeDataAccess = custAttribute.attributes[6].value;
				// } else {
				// 	that.custCodeDataAccess = "No Access";

				// }
				// if (custAttribute.attributes[8] !== undefined) {
				// 	that.orderTypeDataAccess = custAttribute.attributes[8].value;
				// } else {
				// 	that.orderTypeDataAccess = "No Access";

				// }
				var loggedInuserId = oEvent.getSource().getData().id; // to get pid
				that.getView().getModel("oLoggedInUserDetailModel").setProperty("/userLoginId", loggedInuserId);
				var userName = oEvent.getSource().getData().name; // to get name 
				that.getView().getModel("oLoggedInUserDetailModel").setProperty("/loggedInUser", userName.givenName + " " + userName.familyName);
				var emailId = oEvent.getSource().getData().emails["0"].value;
				that.getView().getModel("oLoggedInUserDetailModel").setProperty("/loggedInUserMail", emailId); // to get email id
				//	that.launchpadTilesFunction(); //method to specify content base on type of tile
				//	that.loadCustomTemplates(); //method to generate filter parameter controls
			});
			oLoggedInUserDetailModel.attachRequestFailed(function (oEvent) {
				MessageBox.error(oEvent.getSource().getData().message);
			});
		},

		onNavigateToDetail: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("oTableModel").getObject().index;
			this.oRouter.navTo("ReturnsDetail", {
				index: index
			});
		},
		onClear: function () {
			this.salesHdrData = {
				DistChan: "",
				DistChanDesc: "",
				salesOrg: "",
				division: "",
				CustomerNo: "",
				shipToParty: "",
				headerDlvBlock: "",
				Reason: "",
				Description: "",
				orderNumber: "",
				materialGroup: "",
				materialGroupDesc: "",
				materialGroup4: "",
				materialGroup4Desc: "",
				billingNumber: "",
				DMSNumber: ""

			};
			this.getView().getModel("SaleHdrModelSet").setData(this.salesHdrData);
			this.getView().getModel("SaleHdrModelSet").refresh(true);
			var oTableModel = this.getView().getModel("oTableModel");
			this.getView().byId("searchField").setValue("");
			if (oTableModel) {
				oTableModel.setData();
				oTableModel.refresh();
			}
		},
		// F4 help SalesOrg================================================================================
		valueHelpRequestSalesOrg: function (oEvent) {
			this.salesOrgInputId = oEvent.getSource().getId();
			var that = this;
			if (!that.salesOrgDataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {

				if (!that.SalesOrgFrag) {
					that.SalesOrgFrag = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.SalesOrg", that);
					that.getView().addDependent(that.SalesOrgFrag);
					var oDataModel = this.getView().getModel("ODataNewService");
					var lang = "";
					/*if (sap.ushell.Container) {
						lang = sap.ui.getCore().getConfiguration().getLanguage();
					} else {*/
					lang = "EN";
					// }
					lang = lang.toUpperCase();
					var filters = [];
					var oFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, that.salesOrgDataAccess)
						],
						and: true
					});
					filters.push(oFilter);
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					oDataModel.read("/ZSALESORGLOOKUPSet", {
						async: true,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var SalesOrgModel = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							SalesOrgModel.getData().results.unshift("");
							SalesOrgModel.setSizeLimit(oData.results.length);
							that.SalesOrgFrag.setModel(SalesOrgModel, "SalesOrgSet");
							that.SalesOrgFrag.open();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.SalesOrgFrag.open();
				}
			}
		},
		//	on confirm SalesOrg
		handleAddSalesOrg: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			if (this.salesOrgInputId === "idFrgQty") {
				var hdrModel = this.getView().getModel("SoldToPartyModSet");
				hdrModel.getData().SalesOrg = selectedObj.SalesOrg;
				hdrModel.getData().SalesOrgDesc = selectedObj.Name;
				hdrModel.refresh();
			} else {
				var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
				salesFilterModel.getData().salesOrg = selectedObj.SalesOrg;
				salesFilterModel.getData().SalesOrgDesc = selectedObj.Name;
				salesFilterModel.refresh();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		//	on cancel SalesOrg
		handleCancelSalesOrg: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		//live search SalesOrg
		onLiveChangeSalesOrg: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		valueHelpRequestDistChan: function (oEvent) {
			var that = this;
			this.distChnlInputId = oEvent.getSource().getId();
			if (!that.distrChannelDataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {

				if (!that.DistChanFrag) {
					that.DistChanFrag = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.DistributionChannel",
						that);
					that.getView().addDependent(that.DistChanFrag);

					var oDataModel = this.getView().getModel("ODataNewService");
					var filters = [];
					var lang = "";
					/*	if (sap.ushell.Container) {
							lang = sap.ui.getCore().getConfiguration().getLanguage();
						} else {*/
					lang = "EN";
					//	}
					lang = lang.toUpperCase();
					var oFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("DistChl", sap.ui.model.FilterOperator.EQ, that.distrChannelDataAccess)
						],
						and: true
					});
					filters.push(oFilter);
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					oDataModel.read("/ZDISTCHLLOOKUPSet", {
						async: false,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var DistChanModel = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							DistChanModel.getData().results.unshift("");
							DistChanModel.setSizeLimit(oData.results.length);
							that.DistChanFrag.setModel(DistChanModel, "DistChanSet");
							that.DistChanFrag.open();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.DistChanFrag.open();
				}
			}
		},
		//	on conform DistChan f4
		handleAddDistChan: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			if (this.distChnlInputId === "idDistChanCC") {
				var hdrModel = this.getView().getModel("SoldToPartyModSet");
				hdrModel.getData().DistChan = selectedObj.DistChl;
				hdrModel.getData().DistChanDesc = selectedObj.Name;
				hdrModel.refresh();
			} else {
				var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
				salesFilterModel.getData().DistChan = selectedObj.DistChl;
				salesFilterModel.getData().DistChanDesc = selectedObj.Name;
				salesFilterModel.refresh();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		handleCancelDistChan: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		// F4 help Division================================================================================
		valueHelpRequestDivision: function (oEvent) {
			this.divisionInputId = oEvent.getSource().getId();
			var that = this;
			if (!that.divisionDataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {

				if (!that.DivisionFrag) {
					that.DivisionFrag = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.Division", that);
					that.getView().addDependent(that.DivisionFrag);
					var oDataModel = this.getView().getModel("ODataNewService");
					var filters = [];
					var lang = "";
					/*	if (sap.ushell.Container) {
							lang = sap.ui.getCore().getConfiguration().getLanguage();
						} else {*/
					lang = "EN";
					//	}
					lang = lang.toUpperCase();
					var oFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.EQ, that.divisionDataAccess)
						],
						and: true
					});
					filters.push(oFilter);
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					oDataModel.read("/ZDIVISIONLOOKUPSet", {
						async: false,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var DivisionModel = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							DivisionModel.getData().results.unshift("");
							DivisionModel.setSizeLimit(oData.results.length);
							that.DivisionFrag.setModel(DivisionModel, "DivisionSet");
							that.DivisionFrag.open();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.DivisionFrag.open();
				}
			}
		},

		//	on confirm Division
		handleAddDivision: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			if (this.divisionInputId === "idFrgPrice") {
				var hdrModel = this.getView().getModel("SoldToPartyModSet");
				hdrModel.getData().Division = selectedObj.Division;
				hdrModel.getData().DivisionDesc = selectedObj.Name;
				hdrModel.refresh();
			} else {
				var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
				salesFilterModel.getData().division = selectedObj.Division;
				salesFilterModel.getData().DivisionDesc = selectedObj.Name;
				salesFilterModel.refresh();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		//	on cancel Division
		handleCancelDivision: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		//live search Division
		onLiveChangeDivision: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		onLiveChangeDistChan: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("DistChl", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		handleVHOType: function (oEvent) {
			var that = this;
			if (!that.orderTypeDataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {
				if (!that.orderType) {
					that.orderType = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.orderType", that);
					that.getView().addDependent(that.orderType);
					var oDataModel = this.getView().getModel("ZDKSH_CC_DAC_LOOKUP_SRV");
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					var filters = [];
					var lang = "";
					lang = "EN";
					lang = lang.toUpperCase();
					var oFilter = new sap.ui.model.Filter({
						filters: [
							// new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("orderType", sap.ui.model.FilterOperator.EQ, that.orderTypeDataAccess)
						]
					});
					filters.push(oFilter);
					oDataModel.read("/orderTypeLookupSet", {
						async: true,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var orderTypeModel = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							orderTypeModel.getData().results.unshift("");
							orderTypeModel.setSizeLimit(oData.results.length);
							that.orderType.setModel(orderTypeModel, "orderTypeModel");
							that.orderType.open();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.orderType.open();
				}
			}
		},
		handleVHDB: function (oEvent) {
			var that = this;
			if (!that.headerBlock) {
				that.headerBlock = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.HeaderBlock", that);
				that.getView().addDependent(that.headerBlock);
				var oDataModel = this.getView().getModel("ZDKSH_CC_DAC_LOOKUP_SRV");
				// var busyDialog = new sap.m.BusyDialog();
				// busyDialog.open();
				oDataModel.read("/headerDlvBlockLookUpSet", {
					async: true,
					success: function (oData, oResponse) {
						// busyDialog.close();
						var headerBlockModel = new sap.ui.model.json.JSONModel({
							"results": oData.results
						});
						headerBlockModel.getData().results.unshift("");
						that.headerBlock.setModel(headerBlockModel, "headerBlockModel");
						that.headerBlock.open();
					},
					error: function (error) {
						// busyDialog.close();
						var errorMsg = "";
						if (error.statusCode === 504) {
							errorMsg = that.getView().getModel("i18n").getProperty("timeout");
							that.errorMsg(errorMsg);
						} else {
							errorMsg = JSON.parse(error.responseText);
							errorMsg = errorMsg.error.message.value;
							that.errorMsg(errorMsg);
						}
					}
				});
			} else {
				that.headerBlock.open();
			}
		},
		handleAddOt: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();

			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().orderType = selectedObj.orderType;
			salesFilterModel.getData().orderTypeDesc = selectedObj.orderTypeDesc;
			salesFilterModel.refresh();

			oEvent.getSource().getBinding("items").filter([]);
		},
		//	on cancel Ret Rsn
		handleCancelOt: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		//live search Ret Rsn
		onLiveOt: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("orderType", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("orderTypeDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		//	on confirm Ret Rsn
		handleAddHB: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();

			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().deliveryBlock = selectedObj.deliveryBlock;
			salesFilterModel.getData().delBlockDesc = selectedObj.delBlockDesc;
			salesFilterModel.refresh();

			oEvent.getSource().getBinding("items").filter([]);
		},
		handlePO: function (oEvent) {
			var that = this;
			if (!that.purchaseOrder) {
				that.purchaseOrder = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.purchaseOrder", that);
				that.getView().addDependent(that.headerBlock);
				var oDataModel = this.getView().getModel("ZDKSH_CC_MASTER_ENQUIRIES_SRV");
				// var busyDialog = new sap.m.BusyDialog();
				// busyDialog.open();
				var filters = [];
				var lang = "";
				if (sap.ushell) {
					if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
						lang = "2";
					} else {
						lang = "E";
					}
				} else {
					lang = "E";
				}
				lang = lang.toUpperCase();
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("languageID", sap.ui.model.FilterOperator.EQ, lang)
					],
					and: true
				});
				filters.push(oFilter);
				oDataModel.read("/purchaseOrderTypeLookUpSet", {
					async: true,
					filters: filters,
					success: function (oData, oResponse) {
						// busyDialog.close();
						var purchaseOrder = new sap.ui.model.json.JSONModel({
							"results": oData.results
						});
						purchaseOrder.getData().results.unshift("");
						purchaseOrder.setSizeLimit(oData.results.length);
						that.purchaseOrder.setModel(purchaseOrder, "purchaseOrderModel");
						that.purchaseOrder.open();
					},
					error: function (error) {
						// busyDialog.close();
						var errorMsg = "";
						if (error.statusCode === 504) {
							errorMsg = that.getView().getModel("i18n").getProperty("timeout");
							that.errorMsg(errorMsg);
						} else {
							errorMsg = JSON.parse(error.responseText);
							errorMsg = errorMsg.error.message.value;
							that.errorMsg(errorMsg);
						}
					}
				});
			} else {
				that.purchaseOrder.open();
			}
		},
		handleAddPO: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();

			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().poType = selectedObj.purchaseOrderType;
			salesFilterModel.getData().poTypeDesc = selectedObj.poTypeDesc;
			salesFilterModel.refresh();

			oEvent.getSource().getBinding("items").filter([]);
		},
		//	on cancel Ret Rsn
		handleCancelPO: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		//live search Ret Rsn
		onLivePO: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("purchaseOrderType", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("poTypeDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		//	on cancel Ret Rsn
		handleCancelHB: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			// this.onResetSoldToParty();
		},
		//live search Ret Rsn
		onLiveHB: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("deliveryBlock", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("delBlockDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		errorMsg: function (errorMsg) {
			sap.m.MessageBox.show(
				errorMsg, {
					styleClass: 'sapUiSizeCompact',
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oAction) {}
				}
			);
		},
		valueHelpRequestMaterialGrp4: function (oEvent) {
			this.matGrp4Placeholder = oEvent.getSource().getPlaceholder();
			var that = this;
			if (!that.materialGroup4DataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {
				// var that = this;
				if (!that.materialGroup4) {
					that.materialGroup4 = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.MaterialGroup4", that);
					that.getView().addDependent(that.materialGroup4);
					var oDataModel = this.getView().getModel("ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
					var filters = [];
					var lang = "";
					if (sap.ushell) {
						if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
							lang = "2";
						} else {
							lang = "EN";
						}
					} else {
						lang = "EN";
					}
					lang = lang.toUpperCase();
					var oFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("materialGroup4", sap.ui.model.FilterOperator.EQ, that.materialGroup4DataAccess)
						],
						and: true
					});
					filters.push(oFilter);
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					oDataModel.read("/ZSearchHelp_MaterialGroup4Set", {
						async: false,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var materialGrp4Model = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							// materialGrp4Model.getData().results.unshift("");
							// if (oData.results.length === 1) {
							// 	var oMultiInput = that.byId(that._getId("MatGrp4From"));
							// 	oMultiInput.addToken(new Token({
							// 		text: oData.results[0].materialGroup4
							// 	}));
							// 	this.MatGrp4 = "materialGroup4 eq" + " " + oData.results[0].materialGroup4;
							// 	this.MatGrp4FromSelectedItems = oData.results[0].materialGroup4;
							// }

							that.materialGroup4.setModel(materialGrp4Model, "materialGrp4Model");
							that.materialGroup4.open();

						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.materialGroup4.open();
				}
			}
		},
		onConfirmChangeMatGrp: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().materialGroup = selectedObj.materialGroup;
			salesFilterModel.getData().materialGroupDesc = selectedObj.materialGroupDesc;
			salesFilterModel.refresh();
			oEvent.getSource().getBinding("items").filter([]);
		},

		valueHelpRequestMaterialGrp: function (oEvent) {
			this.matGrpPlaceholder = oEvent.getSource().getPlaceholder();
			var that = this;
			if (!that.materialGroupDataAccess) {
				MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			} else {
				// var that = this;
				if (!that.MaterialGroup) {
					that.MaterialGroup = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.MaterialGroup", that);
					that.getView().addDependent(that.MaterialGroup);
					var oDataModel = this.getView().getModel("ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
					var filters = [];
					var lang = "";
					var lang = "";
					if (sap.ushell) {
						if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
							lang = "2";
						} else {
							lang = "EN";
						}
					} else {
						lang = "EN";
					}
					lang = lang.toUpperCase();
					var oFilter = new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, lang),
							new sap.ui.model.Filter("materialGroup", sap.ui.model.FilterOperator.EQ, that.materialGroupDataAccess)
						],
						and: true
					});
					filters.push(oFilter);
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					oDataModel.read("/ZSearchHelp_MaterialGroupSet", {
						async: false,
						filters: filters,
						success: function (oData, oResponse) {
							busyDialog.close();
							var MaterialGroupModel = new sap.ui.model.json.JSONModel({
								"results": oData.results
							});
							// MaterialGroupModel.getData().results.unshift("");
							// if (oData.results.length === 1) {
							// 	var oMultiInput = that.byId(that._getId("MatGrpFrom"));
							// 	oMultiInput.addToken(new Token({
							// 		text: oData.results[0].materialGroup
							// 	}));
							// 	this.MatGrp = "materialGroup eq" + " " + oData.results[0].materialGroup;
							// 	this.MatGrpFromSelectedItems = oData.results[0].materialGroup;
							// }
							that.MaterialGroup.setModel(MaterialGroupModel, "MaterialGroupModel");
							that.MaterialGroup.open();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							if (error.statusCode === 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								that.errorMsg(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								that.errorMsg(errorMsg);
							}
						}
					});
				} else {
					that.MaterialGroup.open();
				}
			}
		},
		onLiveChangeMatGrp: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("materialGroupDesc", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("materialGroup", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		valueHelpRequestReason: function (oEvent) {
			var that = this;
			if (!that.RejectReason) {
				that.RejectReason = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.RejectReason", that);
				that.getView().addDependent(that.RejectReason);
				var oDataModel = this.getView().getModel("ZDKSH_CC_MASTER_ENQUIRIES_SRV");
				var filters = [];
				var lang = "";
				if (sap.ushell) {
					if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
						lang = "2";
					} else {
						lang = "E";
					}
				} else {
					lang = "E";
				}
				lang = lang.toUpperCase();
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("languageID", sap.ui.model.FilterOperator.EQ, lang)
					],
					and: true
				});
				filters.push(oFilter);
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				oDataModel.read("/RejectReasonLookUpSet", {
					async: false,
					filters: filters,
					success: function (oData, oResponse) {
						busyDialog.close();
						var RejectReasonModel = new sap.ui.model.json.JSONModel({
							"results": oData.results
						});
						RejectReasonModel.getData().results.unshift("");
						that.RejectReason.setModel(RejectReasonModel, "RejectReasonModel");
						that.RejectReason.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = "";
						if (error.statusCode === 504) {
							errorMsg = that.getView().getModel("i18n").getProperty("timeout");
							that.errorMsg(errorMsg);
						} else {
							errorMsg = JSON.parse(error.responseText);
							errorMsg = errorMsg.error.message.value;
							that.errorMsg(errorMsg);
						}
					}
				});
			} else {
				that.RejectReason.open();
			}
		},
		handleRejectReason: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().reason = selectedObj.rejReason;
			salesFilterModel.getData().reasonDesc = selectedObj.rejReasonDesc;
			salesFilterModel.refresh();
			oEvent.getSource().getBinding("items").filter([]);
		},
		onLiveChangeRejectReason: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("rejReason", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("rejReasonDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		valueHelpItemDelivery: function (oEvent) {
			var that = this;
			if (!that.ItemDelivery) {
				that.ItemDelivery = sap.ui.xmlfragment("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.fragments.ItemBlock", that);
				that.getView().addDependent(that.RejectReason);
				var oDataModel = this.getView().getModel("ZDKSH_CC_ITM_LOOKUP_SRV");
				var filters = [];
				var lang = "";
				if (sap.ushell) {
					if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
						lang = "2";
					} else {
						lang = "EN";
					}
				} else {
					lang = "EN";
				}
				lang = lang.toUpperCase();
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, lang)
					],
					and: true
				});
				filters.push(oFilter);
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				oDataModel.read("/DeliveryBlckReasonSet", {
					async: false,
					filters: filters,
					success: function (oData, oResponse) {
						busyDialog.close();
						var ItemDeliveryModel = new sap.ui.model.json.JSONModel({
							"results": oData.results
						});
						ItemDeliveryModel.getData().results.unshift("");
						that.ItemDelivery.setModel(ItemDeliveryModel, "ItemDeliveryModel");
						that.ItemDelivery.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = "";
						if (error.statusCode === 504) {
							errorMsg = that.getView().getModel("i18n").getProperty("timeout");
							that.errorMsg(errorMsg);
						} else {
							errorMsg = JSON.parse(error.responseText);
							errorMsg = errorMsg.error.message.value;
							that.errorMsg(errorMsg);
						}
					}
				});
			} else {
				that.ItemDelivery.open();
			}
		},
		handleItemDelivery: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().itemDelivery = selectedObj.DeliveryBlock;
			salesFilterModel.getData().itemDeliveryDesc = selectedObj.Text;
			salesFilterModel.refresh();
			oEvent.getSource().getBinding("items").filter([]);
		},
		onLiveChangeItemDelivery: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("DeliveryBlock", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		onLiveChangeMatGrp4: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("materialGroup4Desc", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("materialGroup4", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		onCancelValueHelp: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},
		onConfirmChangeMatGrp4: function (oEvent) {
			var selectedObj = oEvent.getParameters().selectedContexts[0].getObject();
			var salesFilterModel = this.getView().getModel("SaleHdrModelSet");
			salesFilterModel.getData().materialGroup4 = selectedObj.materialGroup4;
			salesFilterModel.getData().materialGroup4Desc = selectedObj.materialGroup4Desc;
			salesFilterModel.refresh();
			oEvent.getSource().getBinding("items").filter([]);
		},
		mandatoryCheck: function (oModelData) {
			if (oModelData.startDate && oModelData.endDate)
				return true;
			else {
				sap.m.MessageBox.information(this.getView().getModel("i18n").getProperty("enterFandT"));
				return false;
			}
		},

		onSearch: function () {
			if (this.allAccess) {
				var oDataModel = this.getView().getModel("ZDKSH_CC_MASTER_ENQUIRIES_SRV");
				var filterData = this.getView().getModel("SaleHdrModelSet").getData();
				if (this.mandatoryCheck(filterData)) {
					var filters = [],
						lang = [],
						aFilters = [],
						sFilters = [];
					if (sap.ushell && sap.ushell.Container) {
						lang = sap.ui.getCore().getConfiguration().getLanguage();
						if (lang.toLowerCase() == "en")
							lang = "E";
						else
							lang = 2;
					} else {
						lang = "E";
					}
					filters.push(new sap.ui.model.Filter("languageID", sap.ui.model.FilterOperator.EQ, lang));
					if (this.MaterialCodeDac && this.MaterialCodeDac != "*") {
						filters.push(new sap.ui.model.Filter("matNumEx", sap.ui.model.FilterOperator.EQ, this.MaterialCodeDac));
					}
					if (this.custCodeDataAccess && this.custCodeDataAccess != "*") {
						filters.push(new sap.ui.model.Filter("custNumEx", sap.ui.model.FilterOperator.EQ, this.custCodeDataAccess));
					}
					if (filterData.salesOrg)
						filters.push(new sap.ui.model.Filter("salesOrg", sap.ui.model.FilterOperator.EQ, filterData.salesOrg));
					else
						filters.push(new sap.ui.model.Filter("salesOrg", sap.ui.model.FilterOperator.EQ, this.salesOrgDataAccess));
					if (filterData.DistChan)
						filters.push(new sap.ui.model.Filter("distChnl", sap.ui.model.FilterOperator.EQ, filterData.DistChan));
					else
						filters.push(new sap.ui.model.Filter("distChnl", sap.ui.model.FilterOperator.EQ, this.distrChannelDataAccess));
					if (filterData.division)
						filters.push(new sap.ui.model.Filter("division", sap.ui.model.FilterOperator.EQ, filterData.division));
					else
						filters.push(new sap.ui.model.Filter("division", sap.ui.model.FilterOperator.EQ, this.divisionDataAccess));
					if (filterData.orderType)
						filters.push(new sap.ui.model.Filter("salesDocType", sap.ui.model.FilterOperator.EQ, filterData.orderType));
					else
						filters.push(new sap.ui.model.Filter("salesDocType", sap.ui.model.FilterOperator.EQ, this.orderTypeDataAccess));
					if (filterData.materialGroup)
						filters.push(new sap.ui.model.Filter("materialGroup", sap.ui.model.FilterOperator.EQ, filterData.materialGroup));
					else
						filters.push(new sap.ui.model.Filter("materialGroup", sap.ui.model.FilterOperator.EQ, this.materialGroupDataAccess));
					if (filterData.materialGroup4)
						filters.push(new sap.ui.model.Filter("materialGroup4", sap.ui.model.FilterOperator.EQ, filterData.materialGroup4));
					else
						filters.push(new sap.ui.model.Filter("materialGroup4", sap.ui.model.FilterOperator.EQ, this.materialGroup4DataAccess));
					if (filterData.deliveryBlock)
						filters.push(new sap.ui.model.Filter("headerDeliveryBlock", sap.ui.model.FilterOperator.EQ, filterData.deliveryBlock));
					if (filterData.poType)
						filters.push(new sap.ui.model.Filter("purchaseOrderType", sap.ui.model.FilterOperator.EQ, filterData.poType));
					if (filterData.vendorMaterial)
						filters.push(new sap.ui.model.Filter("vendorMatNum", sap.ui.model.FilterOperator.EQ, filterData.vendorMaterial));
					if (filterData.material)
						filters.push(new sap.ui.model.Filter("materialNumber", sap.ui.model.FilterOperator.EQ, filterData.material));
					if (filterData.customerNumber)
						filters.push(new sap.ui.model.Filter("customerNumber", sap.ui.model.FilterOperator.EQ, filterData.customerNumber));

					//DMS Number
					if (filterData.DMSNumber)
						filters.push(new sap.ui.model.Filter("DMSNumber", sap.ui.model.FilterOperator.EQ, filterData.DMSNumber));
					//Billing Number	
					if (filterData.billingNumber) {
						// [+]Start Modification - STRY0017413 Invoice Search Enhancement
						if (filterData.salesOrg === "" || filterData.division === "" || filterData.DistChan === "") {
							sap.m.MessageBox.information(this.getView().getModel("i18n").getProperty("enterFilterSearch"));
							return false;
						} else {
							filters.push(new sap.ui.model.Filter("billingNumber", sap.ui.model.FilterOperator.EQ, filterData.billingNumber));
							//----STRY0017413
							filters.push(new sap.ui.model.Filter("distChnl", sap.ui.model.FilterOperator.EQ, filterData.DistChan));
							filters.push(new sap.ui.model.Filter("division", sap.ui.model.FilterOperator.EQ, filterData.division));
							filters.push(new sap.ui.model.Filter("salesOrg", sap.ui.model.FilterOperator.EQ, filterData.salesOrg));
						}
						// [+]End Modification - STRY0017413 Invoice Search Enhancement
					}
					// [+]Start Modification - STRY0017627 Customer PO Number Search
					//PO Number
					if (filterData.PONo) {
						if (filterData.materialGroup === "" && !filterData.salesOrderFrom && !filterData.salesOrderTo) {
							sap.m.MessageBox.information(this.getView().getModel("i18n").getProperty("enterPOSearch"));
							return false;
						} else {
							filters.push(new sap.ui.model.Filter("PONo", sap.ui.model.FilterOperator.EQ, filterData.PONo));
						}
					}
					// [+]End Modification - STRY0017627 Customer PO Number Search

					if (filterData.itemDelivery)
						filters.push(new sap.ui.model.Filter("itemDeliveryBock", sap.ui.model.FilterOperator.EQ, filterData.itemDelivery));
					if (filterData.reason)
						filters.push(new sap.ui.model.Filter("rejectReason", sap.ui.model.FilterOperator.EQ, filterData.reason));
					if (filterData.pendingOrder)
						filters.push(new sap.ui.model.Filter("pendingOrder", sap.ui.model.FilterOperator.EQ, 'X'));
					if (filterData.startDate) {
						var date = String(filterData.startDate.getDate()).length == 1 ? "0" + filterData.startDate.getDate() : filterData.startDate.getDate();
						var month = filterData.startDate.getMonth() + 1;
						month = String(month).length == 1 ? "0" + (month) : month;
						var year = filterData.startDate.getFullYear();
						var fullDate = year + "-" + month + "-" + date;
					}
					if (filterData.endDate) {
						var date = String(filterData.endDate.getDate()).length == 1 ? "0" + filterData.endDate.getDate() : filterData.endDate.getDate();
						var month = filterData.endDate.getMonth() + 1;
						month = String(month).length == 1 ? "0" + (month) : month;
						var year = filterData.endDate.getFullYear();
						var endFullDate = year + "-" + month + "-" + date;
					}
					if (fullDate && endFullDate) {
						var oFilter = new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("documentDate", sap.ui.model.FilterOperator.GE, fullDate),
								new sap.ui.model.Filter("documentDate", sap.ui.model.FilterOperator.LE, endFullDate)
							],
							and: true
						});
					} else if (fullDate) {
						var oFilter = new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("documentDate", sap.ui.model.FilterOperator.GE, fullDate)
							]
						});
					}
					if (filterData.salesOrderFrom && filterData.salesOrderTo) {
						var sFilter = new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("salesDocNumber", sap.ui.model.FilterOperator.GE, filterData.salesOrderFrom),
								new sap.ui.model.Filter("salesDocNumber", sap.ui.model.FilterOperator.LE, filterData.salesOrderTo)
							],
							and: true
						});
					} else if (filterData.salesOrderFrom) {
						var sFilter = new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("salesDocNumber", sap.ui.model.FilterOperator.EQ, filterData.salesOrderFrom),
							]
						});
					}
					if (oFilter)
						filters.push(oFilter);
					if (sFilter)
						filters.push(sFilter);
					// filters.push(new sap.ui.model.Filter("materialNumber", sap.ui.model.FilterOperator.EQ, 100008137));
					// filters.push(new sap.ui.model.Filter("salesDocNumber", sap.ui.model.FilterOperator.EQ, 5178001846));
					var url = "/SOEnq_HeaderSet";
					var busyDialog = new sap.m.BusyDialog();
					busyDialog.open();
					var that = this;
					oDataModel.read(url, {
						urlParameters: {
							"$expand": "HeaderToItemNav,HeaderToPartnersNav"
						},
						async: false,
						filters: filters,
						success: function (oData, oResponse) {
							that.getView().byId("searchField").setValue("");
							var oTableModel = new sap.ui.model.json.JSONModel();
							oTableModel.setProperty("/results1", oData.results);
							// if (oData.results.length > 0) {
							// for (var i = 0; i < oData.results.length; i++) {
							// 	oTableModel.getData().results[i].fdocumentDate = incture.com.ConnectClientMatEnquiry.model.formatter.dateDetailFormatter(
							// 		oTableModel.getData()
							// 		.results[i].documentDate);
							// 	if (oData.results[i].HeaderToItemNav.results && oData.results[i].HeaderToItemNav.results.length > 0) {
							// 		oTableModel.getData().results[i].netAmount = oData.results[i].HeaderToItemNav.results[0].netAmount;
							// 		oTableModel.getData().results[i].billingNumber = oData.results[i].HeaderToItemNav.results[0].billingNumber;
							// 		oTableModel.getData().results[i].deliveryNumber = oData.results[i].HeaderToItemNav.results[0].deliveryNum;
							// 	}
							// }
							if (oData.results.length > 0) {
								oTableModel.getData().results = [];
								for (var i = 0; i < oData.results.length; i++) {
									if (oData.results[i].HeaderToItemNav.results && oData.results[i].HeaderToItemNav.results.length > 0) {
										for (var j = 0; j < oData.results[i].HeaderToItemNav.results.length; j++) {
											oTableModel.getData().results.push({
												"salesDocNumber": oData.results[i].salesDocNumber,
												"fdocumentDate": incture.com.ConnectClientMatEnquiry.model.formatter.dateDetailFormatter(oData.results[i].documentDate),
												"customerNumber": oData.results[i].customerNumber,
												"customerName": oData.results[i].customerName,
												"netAmount": oData.results[i].HeaderToItemNav.results[j].netAmount,
												"billingNumber": oData.results[i].HeaderToItemNav.results[j].billingNumber,
												"DMSNumber": oData.results[i].HeaderToItemNav.results[j].DMSNumber,
												"deliveryNumber": oData.results[i].HeaderToItemNav.results[j].deliveryNum,
												"salesTerritory": oData.results[i].HeaderToItemNav.results[j].salesTerritory,
												"salesTeam": oData.results[i].HeaderToItemNav.results[j].salesTeam,
												"index": i,
												"materialNumber": oData.results[i].HeaderToItemNav.results[j].materialNumber,
												"materialDescription": oData.results[i].HeaderToItemNav.results[j].materialDescription,
												"purchaseOrderType": oData.results[i].purchaseOrderType,
												"purchaseOrderTypeDesc": oData.results[i].purchaseOrderTypeDesc
											});
										}
									}
								}
								oTableModel.setSizeLimit(oTableModel.getData().results.length);
								that.getView().setModel(oTableModel, "oTableModel");
								oTableModel.refresh();
								var oGlobalModel = new sap.ui.model.json.JSONModel();
								oGlobalModel.setProperty("/results", oData.results);
								sap.ui.getCore().setModel(oGlobalModel, "oGlobalModel");
								that.getView().byId("exportId").setEnabled(true);
								that.onUpdateFinshed();
							} else {
								var oTableModel = new sap.ui.model.json.JSONModel();
								that.getView().setModel(oTableModel, "oTableModel");
								oTableModel.setProperty("/results", "");
								sap.m.MessageBox.error(that.getView().getModel("i18n").getProperty("dataNotFound"));
								that.getView().byId("exportId").setEnabled(false);
							}
							busyDialog.close();
							// that.getView().byId("idRet1").fireUpdateFinshed();
						},
						error: function (error) {
							busyDialog.close();
							var errorMsg = "";
							var oTableModel = new sap.ui.model.json.JSONModel();
							that.getView().setModel(oTableModel, "oTableModel");
							oTableModel.setProperty("/results", "");
							if (error.responseText.includes("abnormal terminated")) {
								errorMsg = that.getView().getModel("i18n").getProperty("timeout");
								sap.m.MessageBox.error(errorMsg);
							} else if (error.statusCode == 504) {
								errorMsg = that.getView().getModel("i18n").getProperty("addMore");
								sap.m.MessageBox.error(errorMsg);
							} else {
								errorMsg = JSON.parse(error.responseText);
								errorMsg = errorMsg.error.message.value;
								sap.m.MessageBox.error(errorMsg);
							}
						}
					});
				}
			} else {
				sap.m.MessageToast.show(this.getView().getModel("i18n").getProperty("DataAccessControl"));
			}
		},
		onDateChange: function (oEvent) {
			var filterData = this.getView().getModel("SaleHdrModelSet").getData();
			if (oEvent.getSource()._getPlaceholder() == "from") {
				if (filterData.endDate && filterData.fromDate > filterData.endDate) {
					sap.m.MessageToast.show(this.getView().getModel("i18n").getProperty("dateRange"));
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValue("");
				} else {
					oEvent.getSource().setValueState("None");
				}
			} else {
				if (!filterData.startDate) {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValue("");
					sap.m.MessageToast.show(this.getView().getModel("i18n").getProperty("enterFromDate"));
				} else if (filterData.endDate && filterData.startDate > filterData.endDate) {
					oEvent.getSource().setValueState("Error");
					oEvent.getSource().setValue("");
					sap.m.MessageToast.show(this.getView().getModel("i18n").getProperty("dateRange"));
				} else {
					oEvent.getSource().setValueState("None");
				}
			}
		},
		onLiveChange: function (oEvent) {
			var value;
			if (oEvent.getParameters().newValue === undefined) {
				value = oEvent.getParameters().query;
			} else {
				value = oEvent.getParameters().newValue;
			}
			var filters = [];
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("salesDocNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("fdocumentDate", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("customerNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("customerName", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("netAmount", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("billingNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("DMSNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("deliveryNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("salesTerritory", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("salesTeam", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("materialNumber", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("materialDescription", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("purchaseOrderType", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("purchaseOrderTypeDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = this.getView().byId("idRet1").getBinding("items");
			oBinding.filter(filters);
			var items = this.getView().byId("idRet1").getItems();
			var indices = oBinding.aIndices;
			for (var i = 0; i < items.length; i++) {
				var data = this.getView().getModel("oTableModel").getData().results;
				if (data[indices[i]].salesDocNumber && data[indices[i]].billingNumber && data[indices[i]].deliveryNumber)
					items[i].setHighlight("Success");
				else if (data[indices[i]].salesDocNumber && data[indices[i]].billingNumber || data[indices[i]].salesDocNumber && data[indices[i]].deliveryNumber)
					items[i].setHighlight("Warning");
				else
					items[i].setHighlight("Error");

			}
		},
		onExport: function () {
			var arr = this.getView().getModel("oTableModel").getData().results1;
			var objectIsNew = jQuery.extend([], arr);
			var oExportModel = new sap.ui.model.json.JSONModel({
				"results": objectIsNew
			});
			var newObj = [];
			oExportModel.setSizeLimit(objectIsNew.length);
			this.getView().setModel(oExportModel, "oExportModel");
			for (var i = 0; i < objectIsNew.length; i++) {
				for (var j = 0; j < objectIsNew[i].HeaderToItemNav.results.length; j++) {
					var object = objectIsNew[i].HeaderToItemNav.results;
					newObj.push({
						salesDocNumber: objectIsNew[i].salesDocNumber,
						fdocumentDate: incture.com.ConnectClientMatEnquiry.model.formatter.dateDetailFormatter(objectIsNew[i].documentDate),
						cCustomer: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(objectIsNew[i].customerNumber, objectIsNew[i].customerName),
						salesTerritory: object[j].salesTerritory,
						salesTeam: object[j].salesTeam,
						creditCheck: objectIsNew[i].creditCheck,
						cOrderReason: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(objectIsNew[i].orderReason, objectIsNew[i].orderReaText),
						customerPO: objectIsNew[i].customerPO,
						cHdb: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(objectIsNew[i].headerDeliveryBlock, objectIsNew[i].headerDlvBlockText),
						address: objectIsNew[i].HeaderToPartnersNav.results[0].address,
						salesDocType: objectIsNew[i].salesDocType,
						cDC: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(objectIsNew[i].distChnl, objectIsNew[i].dcName),
						cPO: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(objectIsNew[i].purchaseOrderType, objectIsNew[i].purchaseOrderTypeDesc),
						aroText: objectIsNew[i].aroText,
						footNote: objectIsNew[i].footNote,
						custThaiName: objectIsNew[i].custThaiName,
						term: objectIsNew[i].term,
						yourRef: objectIsNew[i].yourRef,
						provinceName: objectIsNew[i].provinceName,
						billingNumber: object[j].billingNumber,
						DMSNumber: object[j].DMSNumber,
						deliveryNumber: object[j].deliveryNum,
						deliveryDate: incture.com.ConnectClientMatEnquiry.model.formatter.dateDetailFormatter(object[j].deliveryDate),
						billingDate: incture.com.ConnectClientMatEnquiry.model.formatter.dateDetailFormatter(object[j].billingDate),

						itemNum: object[j].itemNumber,
						cMatNum: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].materialNumber, object[j].materialDescription),
						materialGroup: object[j].materialGroup,
						materialGroup4: object[j].materialGroup4,
						materialGroup1: object[j].materialGroup1,
						vendorMatNum: object[j].vendorMatNum,
						cQty: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].qtySold, object[j].salesUnit),
						cFOC: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].focQty, object[j].salesUnit),
						listPrice: object[j].listPrice,
						specialPrice: object[j].specialPrice,
						netAmount: object[j].netAmount,
						batchNum: incture.com.ConnectClientMatEnquiry.model.formatter.expiryDateBind(object[j].batchNum, object[j].expiryDate),
						itemDeliveryBock: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].itemDeliveryBock, object[j]
							.itemDlvBlockText),
						rejectReason: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].rejectReason, object[j].rejectDescription),
						use: object[j].use,
						storageLocation: incture.com.ConnectClientMatEnquiry.model.formatter.f4ValueBind(object[j].storageLocation, object[j].storageLocDesc),
						shippingPoint: object[j].shippingPoint,
						highLevel: object[j].highLevel,
						b2bStatus: object[j].b2bStatus.replace(/[@]/g, ' ')
					});
				}
			}
			// for (var i = 0; i < arr.length; i++) {
			// 	arr[i].cCustomer = arr[i].customerNumber ? arr[i].customerNumber + "(" + arr[i].customerName + ")" : arr[i].customerNumber;
			// 	arr[i].cOrderReason = arr[i].orderReason ? arr[i].orderReason + "(" + arr[i].orderReaText + ")" : arr[i].orderReason;
			// 	arr[i].cHdb = arr[i].headerDeliveryBlock ? arr[i].headerDeliveryBlock + "(" + arr[i].headerDlvBlockText + ")" : arr[i].headerDeliveryBlock;
			// 	arr[i].address = arr[i].HeaderToPartnersNav.results[0].address;
			// 	arr[i].cDC = arr[i].distChnl ? arr[i].distChnl + "(" + arr[i].dcName + ")" : arr[i].distChnl;
			// }
			var aCols = [{
				label: 'Sales Order',
				property: 'salesDocNumber'
			}, {
				label: 'Order Date',
				property: 'fdocumentDate'
			}, {
				label: 'Customer',
				property: 'cCustomer'
			}, {
				label: 'Net Amount',
				property: 'netAmount'
			}, {
				label: 'Billing Number',
				property: 'billingNumber'
			}, {
				label: 'Local Ref No',
				property: 'DMSNumber'
			}, {
				label: 'Delivery Number',
				property: 'deliveryNumber'
			}, {
				label: 'Sales Territory',
				property: 'salesTerritory'
			}, {
				label: 'Sales Team',
				property: 'salesTeam'
			}, {
				label: 'Billing Date',
				property: 'billingDate'
			}, {
				label: 'Delivery Date',
				property: 'deliveryDate'
			}, {
				label: 'Credit Check',
				property: 'creditCheck'
			}, {
				label: 'Order reason',
				property: 'cOrderReason'
			}, {
				label: 'Customer PO.',
				property: 'customerPO'
			}, {
				label: 'Header Block',
				property: 'cHdb'
			}, {
				label: 'Address',
				property: 'address'
			}, {
				label: 'Order Type',
				property: 'salesDocType'
			}, {
				label: 'Dist Channel',
				property: 'cDC'
			}, {
				label: 'ARO Text',
				property: 'aroText'
			}, {
				label: 'Foot Note',
				property: 'footNote'
			}, {
				label: 'Customer (Local)',
				property: 'custThaiName'
			}, {
				label: 'Payment Term',
				property: 'term'
			}, {
				label: 'Your Reference',
				property: 'yourRef'
			}, {
				label: 'Province',
				property: 'provinceName'
			}, {
				label: 'Item No.',
				property: 'itemNum'
			}, {
				label: 'Material',
				property: 'cMatNum'
			}, {
				label: 'Material Group',
				property: 'materialGroup'
			}, {
				label: 'Material Group4',
				property: 'materialGroup4'
			}, {
				label: 'Material Group1',
				property: 'materialGroup1'
			}, {
				label: 'Vendor Mat.',
				property: 'vendorMatNum'
			}, {
				label: 'Sales Qty(Unit)',
				property: 'cQty'
			}, {
				label: 'FOC Qty(Unit)',
				property: 'cFOC'
			}, {
				label: 'List Price',
				property: 'listPrice'
			}, {
				label: 'Special Price',
				property: 'specialPrice'
			}, {
				label: 'Batch(Exp)',
				property: 'batchNum'
			}, {
				label: 'Item block',
				property: 'itemDeliveryBock'
			}, {
				label: 'Rejection reason',
				property: 'rejectReason'
			}, {
				label: 'Usage',
				property: 'use'
			}, {
				label: 'SLOC',
				property: 'storageLocation'
			}, {
				label: 'Shipping Point',
				property: 'shippingPoint'
			}, {
				label: 'High Level',
				property: 'highLevel'
			}, {
				label: 'Status',
				property: 'b2bStatus'
			}, {
				label: 'PO Type',
				property: 'cPO'
			}];
			var aCols, oSettings, oSheet;
			aCols = aCols;
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: newObj,
				showProgress: false
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					// MessageToast.show("spreadsheet Export Finished");
				})
				.finally(function () {
					oSheet.destroy();
				});
		},
		onUpdateFinshed: function () {
			// var oTableModel = this.getView().getModel("oTableModel");
			// var id = "__item16-__xmlview0--idRet1-";
			var data = this.getView().getModel("oTableModel").getData().results;
			var oTable = this.getView().byId("idRet1");
			var oItems = oTable.getItems();
			if (data && data.length > 0)
				for (var i = 0; i < data.length; i++) {
					if (data[i].salesDocNumber && data[i].billingNumber && data[i].deliveryNumber)
						oItems[i].setHighlight("Success");
					// $("#" + id + i + "_cell0").addClass("successColor");
					else if (data[i].salesDocNumber && data[i].billingNumber || data[i].salesDocNumber && data[i].deliveryNumber)
					// $("#" + id + i + "_cell0").addClass("warningColor");
						oItems[i].setHighlight("Warning");
					else
					// $("#" + id + i + "_cell0").addClass("errorColor");
						oItems[i].setHighlight("Error");
				}
		},
		onPressCollapse: function () {
			this.getView().getModel("baseModel").setProperty("/openVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", false);
		},
		onPressOpen: function () {
			this.getView().getModel("baseModel").setProperty("/openVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", true);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ReturnsView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ReturnsView
		 */
		onAfterRendering: function () {},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf incture.com.cherrywork.ConnectClientSalesOrderEnquiry.view.ReturnsView
		 */
		//	onExit: function() {
		//
		//	}

	});

});