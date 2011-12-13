var tbdialoutPassWarn = {
  onPassWarnLoad: function() {
    this.strings = document.getElementById("tbdialout-strings");
    document.title = this.strings.getString("warningDefaultTitle");
    document.getElementById("tbdoPassWarnBrowser").setAttribute('src', "http://www.oak-wood.co.uk/oss/tbdialout/passwords");
  },
}