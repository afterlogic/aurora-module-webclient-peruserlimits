'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

    App = require('%PathToCoreWebclientModule%/js/App.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
    ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
    CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass')
;

/**
* @constructor
*/
function VipAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	/* Editable fields */
	this.iId = ko.observable(0);
	this.iVip = ko.observable(false);
	/*-- Editable fields */
	this.startError = ko.observable('');
	this.setStartError();
}

_.extendOwn(VipAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

VipAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_VipAdminSettingsView';

VipAdminSettingsView.prototype.setStartError = function ()
{
	this.startError((Settings.iVip === '') ? TextUtils.i18n('%MODULENAME%/ERROR_SAVE') : '');
};

/**
 * Sends a request to the server to save the settings.
 */
VipAdminSettingsView.prototype.save = function ()
{
    if (!_.isFunction(this.validateBeforeSave) || this.validateBeforeSave())
    {
        this.isSaving(true);

        Ajax.send(this.sServerModule, 'ChangeVipStatus', this.getParametersForSave(), this.onResponse, this);
    }
};

/**
 * Returns error text to show on start if the tab has empty fields.
 *
 * @returns {String}
 */
VipAdminSettingsView.prototype.getStartError = function ()
{
	return this.startError;
};

VipAdminSettingsView.prototype.getCurrentValues = function()
{
    var iVip = false;
    App.subscribeEvent('ReceiveAjaxResponse::after', _.bind(function (oParams) {
        var oResult = oParams.Response.Result;
        iVip = oResult.Vip;
        this.iVip(iVip);
    }, this));

	return [
        this.iVip()
	];
};

VipAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'iVip': this.iVip(),
		'iId': this.iId()
	};
};

VipAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
    this.iId(iEntityId);
	this.visible(sEntityType === 'User');
};


VipAdminSettingsView.prototype.changeState = function ()
{
    return !this.iVip();
};

module.exports = new VipAdminSettingsView();
