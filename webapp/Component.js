sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "incture/com/cherrywork/ConnectClientSalesOrderEnquiry/model/models"], function (
	UIComponent, Device, models) {
	"use strict";
	return UIComponent.extend("incture.com.cherrywork.ConnectClientSalesOrderEnquiry.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device")
		}
	})
});