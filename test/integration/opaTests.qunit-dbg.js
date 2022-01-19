/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"incture/com/cherrywork/ConnectClientSalesOrderEnquiry/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});