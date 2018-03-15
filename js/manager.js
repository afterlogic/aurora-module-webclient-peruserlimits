'use strict';

module.exports = function (oAppData) {
    var

        App = require('%PathToCoreWebclientModule%/js/App.js'),

        Settings = require('modules/%ModuleName%/js/Settings.js'),

        TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

        Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),

        bNormalUser = App.getUserRole() === Enums.UserRole.NormalUser
    ;

    Settings.init(oAppData);

    if (bNormalUser)
    {
        return {
            start: function (ModulesManager) {
                App.subscribeEvent('Jua::Event:after', function (oParams) {
                    if (oParams.Name === 'onComplete') {
                        var sUid = oParams.Arguments[0];
                        var bSuccess = oParams.Arguments[1];
                        var oResult = oParams.Arguments[2];
                        if (oResult.Module === 'Mail' && oResult.ErrorMessage === 'ErrorMaxMailAttachmentSize') {
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_MAIL_ATTACHMENT_SIZE'));
                        }
                    }
                });

                App.subscribeEvent('ReceiveAjaxResponse::after', function (oParams) {
                    if (oParams.Request.Module === 'Contacts' && oParams.Request.Method === 'CreateContact')
                    {

                        if(!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxContacts'){
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_CONTACTS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Contacts' && oParams.Request.Method === 'CreateGroup')
                    {
                        if(!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxGroups'){
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_GROUPS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Calendar' && oParams.Request.Method === 'CreateCalendar')
                    {
                        if(!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxCalendars'){
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_CALENDARS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Files' && oParams.Request.Method === 'CreateFolder')
                    {
                        if(!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxFoldersCloud'){
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_FOLDERS_CLOUD'));
                        }
                    }
                    else if (oParams.Request.Module === 'Files' && oParams.Request.Method === 'UploadFile')
                    {
                        if(!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxFileSizeCloud'){
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_FILE_SIZE_CLOUD'));
                        }
                    }
                });
            }
        };
    }

    return null;
};
