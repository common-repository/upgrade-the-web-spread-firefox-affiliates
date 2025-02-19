var jsonButtons;

// Set the message of the drop down header
jQuery(document).ready(function() {
    var close_button = jQuery("div#sfx_close");
    var header = jQuery("div#sfx_header");

    jQuery(close_button).click(function () {
        jQuery(header).hide();
        jQuery(close_button).hide();
    });

    // Detect MSIE and versions <= 6.0, display top drop down
    jQuery.each(jQuery.browser, function(i, val) {
        if ( (i== 'msie' && val) && (parseFloat(jQuery.browser.version) <= 6.0) ) {
            if (!sfx_check_cookie()) {
                jQuery(close_button).slideDown(1000);
                jQuery(header).slideDown(1000);
                sfx_cookie();
            }
        }
    });
});


function sfx_apply_image (strSize, strLocale, strAffiliateId, strPluginUrl, strButtonList) {

    var strCurrentBrowser = 'other';

    // detect browser
    if (jQuery.browser.msie)
        strCurrentBrowser = 'msie';

    if (jQuery.browser.mozilla) {
        strCurrentBrowser = 'firefox';
        if (jQuery.browser.version.substr(0,3) >= parseFloat("1.9") )
            strCurrentBrowser = 'firefox35';
    }
    
    var imageList = strButtonList.split('::');
    jQuery.each (imageList, 
    	function (i, imageData) {
		var strDataArray = imageData.split('||');
		if (strDataArray) {		
			if (strCurrentBrowser == strDataArray[0].toLowerCase() ) {
				jQuery("#sfx_image").attr("src", strDataArray[1]);	
				strDataArray[2] = strDataArray[2].replace(/&amp;/g,'&');
				strDataArray[2] =  strDataArray[2].replace(/(&|\?)uid=\d+/, '');
				 if (strAffiliateId) {
				     if (strDataArray[2].indexOf('?') == -1) {
					 jQuery("#sfx_image_url").attr("href", strDataArray[2] + '?uid=' + strAffiliateId);
				     } else {					 
					 jQuery("#sfx_image_url").attr("href", strDataArray[2]+ '&uid=' + strAffiliateId);
				     }
				 } else {
				    jQuery("#sfx_image_url").attr("href", strDataArray[2]);
				 }
			}		
		}		
	}
    );
}

// Cookie creator for SFX
function sfx_cookie () {
    var date = new Date();
    date.setTime(date.getTime() + (7*24*60*60*60) );
    document.cookie = "msie6message=yes; expires=" + date.toGMTString() + "; path=/";
}

// Cookie checker for SFX
function sfx_check_cookie () {
    var results = document.cookie.match ( '(^|;)?msie6message' );
    if (results) return true; else return null;
}

// Update the select boxes with new locales and image sizes
function sfx_update_buttons (locale, size, strPluginUrl) {
  jQuery.getJSON(strPluginUrl + "/spreadfirefox/js/sfx.json",
    function(localJson){
      jQuery.getJSON(strPluginUrl + "/spreadfirefox/getRemoteJson.php?r=" + Math.floor(Math.random()*9999999),
        function(data){
          jsonButtons = jQuery.extend(localJson,data);
          
          jQuery("#sfx_locale",jQuery('#TB_window')).removeOption(/./);
          jQuery("#sfx_button_size",jQuery('#TB_window')).removeOption(/./);
          jQuery.each(jsonButtons.buttons,
              function(i,button){
                  // Add size data to select box
                  if (size.toLowerCase() == button.size.toLowerCase())
                      jQuery("#sfx_button_size",jQuery('#TB_window')).addOption (button.size, button.size, true);
                  else
                      jQuery("#sfx_button_size",jQuery('#TB_window')).addOption (button.size, button.size, false);

                  // Add locale data to select box
                  if (locale.toLowerCase() == button.locale.toLowerCase())
                      jQuery("#sfx_locale",jQuery('#TB_window')).addOption (button.locale, button.locale, true);
                  else
                      jQuery("#sfx_locale",jQuery('#TB_window')).addOption (button.locale, button.locale, false);

                  // Show the images matching selection, the preview box, uncomment to view example
                  if (size.toLowerCase() == button.size.toLowerCase() && locale.toLowerCase() == button.locale.toLowerCase())
                    jQuery('#sfx_image_preview', jQuery('#TB_window')).append('<img src="'+button.src+'" />');
                    //jQuery("<img/>",jQuery('#TB_window')).attr("src", button.src).appendTo("#sfx_image_preview");

              }
          );
          jQuery("#sfx_locale",jQuery('#TB_window')).sortOptions();
          jQuery("#sfx_button_size",jQuery('#TB_window')).sortOptions();
          sfx_update_images();
        }
      );
    }
  );
}

// Update the labels after a selection
function sfx_update_labels () {
     var locale = jQuery("#sfx_locale option:selected",jQuery('#TB_window'))[0].value;
     var size = jQuery("#sfx_button_size option:selected",jQuery('#TB_window'))[0].value;

	if (locale && size) {
	     jQuery(".sfx_lbl_size").html(size);
	     jQuery(".sfx_lbl_locale").html(locale);   

	     jQuery(".sfx_button_size_select").removeOption(/./);
	     jQuery(".sfx_locale_select").removeOption(/./);

             jQuery(".sfx_button_size_select").addOption (size, size, true);
	     jQuery(".sfx_locale_select").addOption (locale, locale, true);
	}

     tb_remove();
}

// This updates the privew box and applies a string to hidden element
function sfx_update_images () {
    if (jsonButtons) {
        var strJsonButtons;
        var locale = jQuery("#sfx_locale option:selected",jQuery('#TB_window'))[0].value;
        var size = jQuery("#sfx_button_size option:selected",jQuery('#TB_window'))[0].value;
        jQuery("#sfx_image_preview",jQuery('#TB_window')).text('');
        jQuery.each (jsonButtons.buttons,
            function (i, button ) {
                if (size.toLowerCase() == button.size.toLowerCase() && locale.toLowerCase() == button.locale.toLowerCase()) {
                    // Show the images matching selection, uncomment to view example
                    jQuery('#sfx_image_preview', jQuery('#TB_window')).append('<img src="'+button.src+'" />');
                    //jQuery("<img/>").attr("src", button.src).appendTo("#sfx_image_preview");

                    if (!strJsonButtons)
                        strJsonButtons = button.browser + '||' + button.src + '||' + button.url + '::';
                    else
                        strJsonButtons += button.browser + '||' + button.src + '||' + button.url + '::';

                }
            }
        );
        jQuery("#sfx_button_list").attr("value", strJsonButtons);
    }
}
