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
var tbdialout = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("tbdialout-strings");
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.tbdialout.");
    // listen for changes of selected cards
    document.getElementById("abResultsTree").addEventListener("select", this.onSelectNewRow, true);

    var tbbuttonadded = this.prefs.getBoolPref("tbbuttonadded");
    if (!tbbuttonadded) {
      window.setTimeout(this.AddToolbarButton, 200);
    }
  },

  // Check whether or not there are phone numbers for the selected
  // contact and disable or enable buttons and menu as appropriate
  onSelectNewRow: function(e) {
    var numtypes = ["CellularNumber", "WorkPhone", "HomePhone"];
    var buttIDs = ["tbdialout-cell-toolbar-button", "tbdialout-work-toolbar-button", "tbdialout-home-toolbar-button"];
    var menuIDs= ["tbdialout-cell", "tbdialout-work", "tbdialout-home"];
    var buttMenuIDs = ["tbdialout-menu-toolbar-menu-cell", "tbdialout-menu-toolbar-menu-work", "tbdialout-menu-toolbar-menu-home"];

    var idx;

    var cards = GetSelectedAbCards();

    // disable the combined button until we know at least one suitable phone number exists
    try { document.getElementById("tbdialout-menu-toolbar-button").disabled = true; } catch (e) {}

    if (cards.length == 1) {
      for (idx in numtypes) {
        pnumber = cards[0].getProperty(numtypes[idx], "");
        pnumber = pnumber.replace(/[^0-9\*#]/g,'');
        if (pnumber.length > 0) {
          try { document.getElementById(buttIDs[idx]).disabled = false; } catch (e) {}
          try { document.getElementById(menuIDs[idx]).disabled = false; } catch (e) {}
          try { document.getElementById(buttMenuIDs[idx]).disabled = false; } catch (e) {}
          // we got at least one good number, so enable the combined button
          try { document.getElementById("tbdialout-menu-toolbar-button").disabled = false; } catch (e) {}
        } else {
          try { document.getElementById(buttIDs[idx]).disabled = true; } catch (e) {}
          try { document.getElementById(menuIDs[idx]).disabled = true; } catch (e) {}
          try { document.getElementById(buttMenuIDs[idx]).disabled = true; } catch (e) {}
        }
      }
    }
    // disable everything if not exactly one card is selected
    else {
      for (idx in numtypes) {
        try { document.getElementById(buttIDs[idx]).disabled = true; } catch (e) {}
        try { document.getElementById(menuIDs[idx]).disabled = true; } catch (e) {}
      }
    }
  },

  // Dial the number stored as num
  // num should be "CellularNumber", "WorkPhone" or "HomePhone"
  onMenuItemCommandDial: function(num) {

    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);

    var OKArgs = ["CellularNumber", "WorkPhone", "HomePhone"];
    if ((OKArgs.join(",")+",").indexOf(num + ",") == -1) {
        promptService.alert(window, this.strings.getString("warningDefaultTitle"),
                               this.strings.getString("errorBadArgsMsg") );
        return;
    }

    var cards = GetSelectedAbCards();

    // dial for the selected card, if exactly one card is selected.
    if (cards.length == 1)
    {
      try {
        var proto = this.prefs.getCharPref( "proto" );
        var prefix = this.prefs.getCharPref( "prefix" );
        var plus = this.prefs.getCharPref( "plus" );
        var customurl = this.prefs.getCharPref( "customurl" );
        var customuser = this.prefs.getCharPref( "customuser" );
        var custompass = this.prefs.getCharPref( "custompass" );
      } catch (err) {
        promptService.alert(window, this.strings.getString("warningDefaultTitle"),
                               this.strings.getString("errorGettingPrefsMsg") + "\n\n" + err.description);
        return;
      }

      // some defaults
      if( proto === void(0) ) proto = "callto:";
      if( prefix === void(0) ) prefix = "";
      if( plus === void(0) ) plus = "";
      if( customurl === void(0) ) customurl = "";
      if( customuser === void(0) ) customuser = "";
      if( custompass === void(0) ) custompass = "";

      var pnumber;
      var leadingplus = false;
      pnumber = cards[0].getProperty(num, "");

      // check for a leading +
      if (pnumber.charAt(0) == '+') {
        leadingplus = true;
      }
      // strip non-numeric characters (except * and # - valid dialing digits)
      pnumber = pnumber.replace(/[^0-9\*#]/g,'');

      // only dial if we actually have a number to dial
      if (pnumber.length > 0) {
        // do replacement of leading +
        if (leadingplus) {
          pnumber = plus+pnumber;
        }
        if (proto == 'custom') {
          var callurl = customurl.replace(/%NUM%/,pnumber);
          var req = new XMLHttpRequest();
          req.open('GET', callurl, true, customuser, custompass);
          req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
              if(req.status != 200) {
                var errorStatus = [req.status, req.statusText];
                promptService.alert(window, this.strings.getString("warningDefaultTitle"),
                                  this.strings.getFormattedString("errorBadHTTPResponse", errorStatus));
              }
            }
          };
          req.send(null);
        } else {
          LaunchUrl(proto+prefix+pnumber);
        }
      }
      else {
        var phoneType = [this.strings.getString(num)];
        promptService.alert(window, this.strings.getString("warningDefaultTitle"),
                               this.strings.getFormattedString("noValidNumberMsg", phoneType));
      }
    }
    else {
      promptService.alert(window, this.strings.getString("warningDefaultTitle"),
                               this.strings.getString("selectExactlyOneMsg"));
    }
  },

  onToolbarButtonCommandDial: function(num) {
    // just reuse the function above.
    tbdialout.onMenuItemCommandDial(num);
  },

  onLinkClickDial: function(num) {
    // just reuse the function above.
    tbdialout.onMenuItemCommandDial(num);
  },

  // Add the combined button to the Address Book tool bar at first run.
  AddToolbarButton: function() {
    try {
      var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.tbdialout.");
      var ButtonId    = "tbdialout-menu-toolbar-button"; // ID of button to add
      var afterId = "button-newmessage";
      var ToolBar  = document.getElementById("ab-bar2");
      var curSetStr  = ToolBar.currentSet;

      if (curSetStr.indexOf(ButtonId) == -1) {

        var curSet = curSetStr.split(",")
        var pos = curSet.indexOf(afterId) + 1 || curSet.length;
        var set = curSet.slice(0, pos).concat(ButtonId).concat(curSet.slice(pos));

        ToolBar.setAttribute("currentset", set.join(","));
        ToolBar.currentSet = set.join(",");
        document.persist(ToolBar.id, "currentset");
        try {
          BrowserToolboxCustomizeDone(true);
        }
        catch (e) {}
      }
    prefs.setBoolPref("tbbuttonadded", true);
    }
    catch (e) {}
  },

};

window.addEventListener("load", function(e) { tbdialout.onLoad(e); }, false);

