var tbdialoutPassWarn = {
  onPassWarnLoad: function() {
    this.strings = document.getElementById("tbdialout-strings");
    document.title = this.strings.getString("warningDefaultTitle");
  },
}