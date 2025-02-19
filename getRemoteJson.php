<?php

/**
 * Quick and Dirty proxy script to merge the remote JSON and local JSON
 * objects that define the Spread Firefox buttons.
 */

define('SFX_BUTTON_URL','http://sfx-images.mozilla.org/utw/buttons.json');

$strRemoteJson = @file_get_contents(SFX_BUTTON_URL);

if(trim($strRemoteJson) == '') {
  echo '{}';
}
else {
  echo $strRemoteJson;
}
