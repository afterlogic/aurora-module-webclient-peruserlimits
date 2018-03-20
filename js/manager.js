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

    if (bNormalUser) {
        return {
            start: function (ModulesManager) {
                App.subscribeEvent('Jua::Event:before', function (oParams) {
                    if (oParams.Name === 'onSelect') {
                        var aArguments = oParams.Arguments[1];
                        var iSize = aArguments.Size;

                        if (oParams.Module === 'Files' && oParams.Method === 'UploadFile') {
                            if (iSize > Settings.MaxFileSizeCloud) {
                                Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_FILE_SIZE_CLOUD', {'SIZE': Settings.MaxFileSizeCloud / (1024 * 1024)}));
                                oParams.Cancel = true;
                            }
                        }
                        else if (oParams.Module === 'Mail' && oParams.Method === 'UploadAttachment') {
                            if (iSize > Settings.MaxMailAttachmentSize) {
                                Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_MAIL_ATTACHMENT_SIZE', {'SIZE': Settings.MaxMailAttachmentSize / (1024 * 1024)}));
                                oParams.Cancel = true;
                            }
                        }
                    }
                });

                App.subscribeEvent('Jua::Event:after', function (oParams) {
                    if (oParams.Name === 'onComplete') {
                        var oResult = oParams.Arguments[2];
                        if (oParams.Module === 'Files' && oParams.Method === 'UploadFile') {
                            if (!oResult.Result && oResult.ErrorMessage === 'ErrorMaxFilesUploadCloud') {
                                Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_FILES_UPLOAD_CLOUD'));
                            }
                        }
                    }
                });

                App.subscribeEvent('ReceiveAjaxResponse::after', function (oParams) {
                    if (oParams.Request.Module === 'Contacts' && oParams.Request.Method === 'CreateContact') {

                        if (!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxContacts') {
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_CONTACTS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Contacts' && oParams.Request.Method === 'CreateGroup') {
                        if (!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxGroups') {
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_GROUPS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Calendar' && oParams.Request.Method === 'CreateCalendar') {
                        if (!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxCalendars') {
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_CALENDARS'));
                        }
                    }
                    else if (oParams.Request.Module === 'Files' && oParams.Request.Method === 'CreateFolder') {
                        if (!oParams.Response.Result && oParams.Response.ErrorMessage === 'ErrorMaxFoldersCloud') {
                            Screens.showError(TextUtils.i18n('PERUSERLIMITSWEBCLIENT/ERROR_MAX_FOLDERS_CLOUD'));
                        }
                    }
                });
            }
        };
    }

    return null;
};
