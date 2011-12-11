/****** BEGIN LICENSE BLOCK *****
  *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
  *
  * The contents of this file are subject to the Mozilla Public License Version
  * 1.1 (the "License"); you may not use this file except in compliance with
  * the License. You may obtain a copy of the License at
  * http://www.mozilla.org/MPL/
  * 
  * Software distributed under the License is distributed on an "AS IS" basis,
  * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
  * for the specific language governing rights and limitations under the
  * License.
  *
  * The Original Code is TBDialOut.
  *
  * The Initial Developer of the Original Code is
  * Chris Hastie http://www.oak-wood.co.uk
  * Portions created by the Initial Developer are Copyright (C) 2010
  * the Initial Developer. All Rights Reserved.
  *
  * TBDialOut was inspired by VOIP3 Dialer by MSelector, although the code
  * has largely been rewritten. http://www.mselector.com
  *
  * Contributor(s):
  *
  * Alternatively, the contents of this file may be used under the terms of
  * either the GNU General Public License Version 2 or later (the "GPL"), or
  * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
  * in which case the provisions of the GPL or the LGPL are applicable instead
  * of those above. If you wish to allow use of your version of this file only
  * under the terms of either the GPL or the LGPL, and not to allow others to
  * use your version of this file under the terms of the MPL, indicate your
  * decision by deleting the provisions above and replace them with the notice
  * and other provisions required by the GPL or the LGPL. If you do not delete
  * the provisions above, a recipient may use your version of this file under
  * the terms of any one of the MPL, the GPL or the LGPL.
  * 
  * ***** END LICENSE BLOCK ***** 
  */

var tbdialoutprefs = {
  onLoad: function() {
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.tbdialout.");
    this.console = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    this.passwordManager = Components.classes["@mozilla.org/login-manager;1"].
        getService(Components.interfaces.nsILoginManager);
    this.nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
        Components.interfaces.nsILoginInfo, "init");
    this.setCustomOptViz();
    this.setCustomAuthViz();
    this.retrievePasswords();
  },
  
  setCustomOptViz: function () {
    var custom_elements = document.getElementsByClassName("tbdocustomoptions");
    var ami_elements = document.getElementsByClassName("tbdoamioptions");
    var idx;
    for (idx in custom_elements) {
      if (document.getElementById("proto_menu").value == 'custom') {
        custom_elements[idx].disabled = false;
      } else {
        custom_elements[idx].disabled = true;
      }
    }
    for (idx in ami_elements) {
      if (document.getElementById("proto_menu").value == 'asteriskami') {
        ami_elements[idx].disabled = false;
      } else {
        ami_elements[idx].disabled = true;
      }
    }
  },

  setCustomAuthViz: function () {
    if (document.getElementById("proto_menu").value == 'custom') {
      var custom_auth_elements = new Array();
      custom_auth_elements.push(document.getElementById("customuser_text"));
      custom_auth_elements.push(document.getElementById("custompass_text"));
      var loadhidden = document.getElementById("custominbackground_cb").checked;
      var idx;
      for (idx in custom_auth_elements) {
        if (loadhidden) {
          custom_auth_elements[idx].disabled = false;
        } else {
          custom_auth_elements[idx].disabled = true;
        }
      }
      var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch("extensions.tbdialout.");
      prefs.setBoolPref("custominbackground", loadhidden);
    }
  },

  openHelp: function () {
    var helpurl = "http://www.oak-wood.co.uk/tbdialout/#configure";
    // try to open the page in a new tab with Thunderbird
    var tabmail = document.getElementById("tabmail");
    if (!tabmail) {
      // Try opening new tabs in an existing 3pane window
      var mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                                      .getService(Components.interfaces.nsIWindowMediator)
                                      .getMostRecentWindow("mail:3pane");
      if (mail3PaneWindow) {
        tabmail = mail3PaneWindow.document.getElementById("tabmail");
        mail3PaneWindow.focus();
      }
    }
    // allow user to click within the site
    var click_re = "^http://www.oak-wood.co.uk/";
    var clickhandler = "specialTabs.siteClickHandler(event, new RegExp(\"" + click_re + "\"));";
    if (tabmail)
      tabmail.openTab("contentTab", {contentPage: helpurl,
                                      clickHandler: clickhandler});
    else
      window.openDialog("chrome://messenger/content/", "_blank",
                        "chrome,dialog=no,all", null,
                        { tabType: "contentTab",
                          tabParams: {contentPage: helpurl,
                                        clickHandler: clickhandler} });
  },

  openPassWarn: function () {
    var warnurl = "chrome://tbdialout/content/passwarn.xul";
    window.openDialog(warnurl, "tbdo_pass_warn", "width=800px,height=350px");
  },

  savePasswords: function () {
    this.logger(5, "tbdialoutprefs.savePasswords called");
    var amisecret = document.getElementById("amisecret_text").value;
    this.setPass('ami.secret', amisecret);
  },

  retrievePasswords: function () {
    this.logger(5, "tbdialoutprefs.retrievePasswords called");
    document.getElementById("amisecret_text").value = this.getPass('ami.secret');
  },

  getPass: function (passid) {
   this.logger(5, "Getting password with id " + passid);
   // Find users for the given parameters
   var logins = this.passwordManager.findLogins({}, 'chrome://tbdialout', null, passid);
   var password = "";
   // Find user from returned array of nsILoginInfo objects
   for (var i = 0; i < logins.length; i++) {
      if (logins[i].username == passid) {
         password = logins[i].password;
         break;
      }
   }
   return password;
  },

  setPass: function (passid, passval) {
    // TODO Get rid of this debugging security leak!!!!
    //this.logger(5, "Saving new value for " + passid + ": " + passval);

    // first remove any existing login
    // Find users for this extension 
    var logins = this.passwordManager.findLogins({}, 'chrome://tbdialout', null, passid);
    for (var i = 0; i < logins.length; i++) {
      if (logins[i].username == passid) {
         this.passwordManager.removeLogin(logins[i]);
         break;
      }
    }

    // now set the new password
    var LoginInfo = new this.nsLoginInfo('chrome://tbdialout',
           null, passid, passid, passval, "", "");

    this.passwordManager.addLogin(LoginInfo);
  },

  logger: function (level, msg) {
    if( this.prefs.getIntPref("loglevel") >= level ) {
      this.console.logStringMessage("[TBDialOut] " + msg);
    }
  },
}