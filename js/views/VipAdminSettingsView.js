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
	this.id = ko.observable(0);
	this.vip = ko.observable(false);
	/*-- Editable fields */
	this.startError = ko.observable('');
	this.setStartError();

    App.subscribeEvent('ReceiveAjaxResponse::after', _.bind(function (oParams) {
        var oRequest = oParams.Request;
        if (oRequest.Method === 'GetEntity' && oRequest.Module === 'AdminPanelWebclient' && oRequest.Parameters.Type === 'User') {
            var oResult = oParams.Response.Result;
            this.vip(oResult.Vip);
        }
    }, this));
}

_.extendOwn(VipAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

VipAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_VipAdminSettingsView';

VipAdminSettingsView.prototype.setStartError = function ()
{
	this.startError((Settings.vip === '') ? TextUtils.i18n('%MODULENAME%/ERROR_SAVE') : '');
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

CAbstractSettingsFormView.prototype.onResponse = function (oResponse, oRequest)
{
    this.isSaving(false);

    if (!oResponse.Result)
    {
        Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_SAVE'));
    }
    else
    {
        var oParameters = oRequest.Parameters;
        this.updateSavedState();
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
	return [
        this.vip()
	];
};

VipAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'vip': this.vip(),
		'id': this.id()
	};
};

VipAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
    this.id(iEntityId);
	this.visible(sEntityType === 'User');
};


VipAdminSettingsView.prototype.changeState = function ()
{
    return !this.vip();
};

module.exports = new VipAdminSettingsView();
