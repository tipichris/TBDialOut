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

function setCustomOptViz() {
  var elements = document.getElementsByClassName("tbdocustomoptions");
  for (idx in elements) {
    if (document.getElementById("proto_menu").value == 'custom') {
      elements[idx].disabled = false;
    } else {
      elements[idx].disabled = true;
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
//  if (document.getElementById("proto_menu").value == 'custom') {
//    document.getElementById("tbdialout-options-customoptions").collapsed = false;
//  } else {
//    document.getElementById("tbdialout-options-customoptions").collapsed = true;
//  }
}