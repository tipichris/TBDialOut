// Import any needed modules.
//var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
//var { gQuicktext } = ChromeUtils.import("chrome://quicktext/content/modules/wzQuicktext.jsm");

// Load additional JavaScript files.
Services.scriptloader.loadSubScript("chrome://tbdialout/content/utils.js", window, "UTF-8");
Services.scriptloader.loadSubScript("chrome://tbdialout/content/overlay.js", window, "UTF-8");


function onLoad(activatedWhileWindowOpen) {
  
  WL.injectCSS("resource://tbdialout/skin/overlay.css");
  WL.injectElements(`
    <menupopup id="abResultsTreeContext">
        <menuitem id="tbdialout-home" label="&tbdialoutHome.label;" 
                oncommand="tbdialout.onMenuItemCommandDial('HomePhone');"/>
        <menuitem id="tbdialout-work" label="&tbdialoutWork.label;" 
                oncommand="tbdialout.onMenuItemCommandDial('WorkPhone');"/>
        <menuitem id="tbdialout-cell" label="&tbdialoutCell.label;" 
                oncommand="tbdialout.onMenuItemCommandDial('CellularNumber');"/>
    </menupopup>

    <toolbarpalette id="AddressBookToolbarPalette">
        <toolbarbutton id="tbdialout-home-toolbar-button"
        label="&tbdialoutToolbarHome.label;"
        tooltiptext="&tbdialoutToolbarHome.tooltip;"
        oncommand="tbdialout.onToolbarButtonCommandDial('HomePhone')"
        class="toolbarbutton-1 chromeclass-toolbar-additional"/>
        <toolbarbutton id="tbdialout-work-toolbar-button"
        label="&tbdialoutToolbarWork.label;"
        tooltiptext="&tbdialoutToolbarWork.tooltip;"
        oncommand="tbdialout.onToolbarButtonCommandDial('WorkPhone')"
        class="toolbarbutton-1 chromeclass-toolbar-additional"/>
        <toolbarbutton id="tbdialout-cell-toolbar-button"
        label="&tbdialoutToolbarCell.label;"
        tooltiptext="&tbdialoutToolbarCell.tooltip;"
        oncommand="tbdialout.onToolbarButtonCommandDial('CellularNumber')"
        class="toolbarbutton-1 chromeclass-toolbar-additional"/>
        <toolbarbutton id="tbdialout-menu-toolbar-button"
        label="&tbdialoutToolbarMenu.label;"
        tooltiptext="&tbdialoutToolbarMenu.tooltip;"
        type="menu"
        class="toolbarbutton-1 chromeclass-toolbar-additional" >
            <menupopup id="tbdialout-menu-toolbar-menu">
            <menuitem id="tbdialout-menu-toolbar-menu-home" label="&tbdialoutButtonMenuHome.label;" 
                        oncommand="tbdialout.onToolbarButtonCommandDial('HomePhone');"/>
            <menuitem id="tbdialout-menu-toolbar-menu-work" label="&tbdialoutButtonMenuWork.label;" 
                        oncommand="tbdialout.onToolbarButtonCommandDial('WorkPhone');"/>
            <menuitem id="tbdialout-menu-toolbar-menu-cell" label="&tbdialoutButtonMenuCell.label;" 
                        oncommand="tbdialout.onToolbarButtonCommandDial('CellularNumber');"/>
            </menupopup>
        </toolbarbutton>
    </toolbarpalette>`,
    ["chrome://tbdialout/locale/tbdialout.dtd"]
  );
  
  window.tbdialout.onLoad();
  
}

function onUnload(deactivatedWhileWindowOpen) {
}