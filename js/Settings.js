'use strict';

var
    _ = require('underscore'),
    Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
    ServerModuleName: 'PerUserLimits',

    Vip: 0,
    MaxFileSizeCloud: 0,
    MaxMailAttachmentSize: 0,
    MaxDownloadsCloud: 0,
    DownloadedSize: 0,
    DateTimeDownloadedSize: 0,

    /**
     * Initializes settings from AppData object sections.
     *
     * @param {Object} oAppData Object contained modules settings.
     */
    init: function (oAppData)
    {
        var
            oAppDataLimitsSection = oAppData[this.ServerModuleName],
            oAppDataLimitsWebclientSection = oAppData['%ModuleName%']
        ;

        if (!_.isEmpty(oAppDataLimitsSection))
        {
            this.Vip = Types.pInt(oAppDataLimitsSection.Vip, this.Vip);
            this.MaxFileSizeCloud = Types.pInt(oAppDataLimitsSection.MaxFileSizeCloud, this.MaxFileSizeCloud);
            this.MaxMailAttachmentSize = Types.pInt(oAppDataLimitsSection.MaxMailAttachmentSize, this.MaxMailAttachmentSize);
            this.MaxDownloadsCloud = Types.pInt(oAppDataLimitsSection.MaxDownloadsCloud, this.MaxDownloadsCloud);
            this.DownloadedSize = Types.pInt(oAppDataLimitsSection.DownloadedSize, this.DownloadedSize);
            this.DateTimeDownloadedSize = Types.pString(oAppDataLimitsSection.DateTimeDownloadedSize, this.DateTimeDownloadedSize);
        }

        if (!_.isEmpty(oAppDataLimitsWebclientSection))
        {

        }
    }
};
