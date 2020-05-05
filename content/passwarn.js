var tbdialoutPassWarn = {
  onPassWarnLoad: function() {
    var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm")
    this.strings = Services.strings.createBundle("chrome://tbdialout/locale/tbdialout.properties");
    document.title = this.strings.GetStringFromName("warningDefaultTitle");
    document.getElementById("tbdoPassWarnBrowser").setAttribute('src', "http://www.oak-wood.co.uk/oss/tbdialout/passwordwarning");
  },
}