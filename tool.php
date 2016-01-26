<?php

/*
tool.php
*/

/**
 *
 * @category        tool
 * @package         Outputfilter Dashboard
 * @version         1.04.00
 * @authors         Thomas "thorn" Hornik <thorn@nettest.thekk.de>, Christian M. Stefan (Stefek) <stefek@designthings.de>, Martin Hecht (mrbaseman) <mrbaseman@gmx.de>
 * @copyright       2009,2010 Thomas "thorn" Hornik, 2010 Christian M. Stefan (Stefek), 2016 Martin Hecht (mrbaseman)
 * @link            https://github.com/WebsiteBaker-modules/outpufilter_dashboard
 * @license         GNU General Public License, Version 3
 * @platform        WebsiteBaker 2.8.x
 * @requirements    PHP 5.4 and higher
 * 
 * This file is part of OutputFilter-Dashboard, a module for Website Baker CMS.
 * 
 * OutputFilter-Dashboard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * OutputFilter-Dashboard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with OutputFilter-Dashboard. If not, see <http://www.gnu.org/licenses/>.
 * 
 **/

// prevent this file from being accessed directly
if(!defined('WB_PATH')) die(header('Location: ../index.php'));

// obtain module directory
$mod_dir = basename(dirname(__FILE__));
require(WB_PATH.'/modules/'.$mod_dir.'/info.php');

// include module.functions.php 
include_once(WB_PATH . '/framework/module.functions.php');

// include the module language file depending on the backend language of the current user
if (!include(get_module_language_file($mod_dir))) return;

// check if user is allowed to use admin-tools (to prevent this file to be called by an unauthorized user e.g. from a code-section)
if(!$admin->get_permission('admintools')) die(header('Location: ../../index.php'));

// load outputfilter-functions
require_once(dirname(__FILE__)."/functions.php");

// check the fTAN - $doSave is set by admin/admintools/tool.php
if($doSave){
    global $MESSAGE;
    if ( method_exists( $admin, 'checkFTAN' ) ) { 
        if (!$admin->checkFTAN('GET')) {
            $admin->print_error($MESSAGE['GENERIC_SECURITY_ACCESS'],
            $ToolUrl);
            $admin->print_footer();
            exit();
        }
    } 
}
$need_footer=FALSE;
if (ob_get_contents()==""&&!headers_sent()){
        if(!defined('NEW_WBCE_VERSION')){
            $admin->print_header();
            $need_footer=TRUE;
        }
}

$ModDir  = basename(dirname(__FILE__));
$ModPath = dirname(__FILE__);
$ModUrl  = WB_URL."/modules/$ModDir";
$ToolUrl = ADMIN_URL."/admintools/tool.php?tool=$ModDir";

$now = time();

// First, perform some actions

// fetch values from $_GET[]
$id        = opf_fetch_get( 'id', NULL, 'int');
$dir       = opf_fetch_get( 'dir', NULL, 'string');
$active    = opf_fetch_get( 'active', NULL, 'int');
$delete    = opf_fetch_get( 'delete', FALSE, 'exists');
$css_save  = opf_fetch_get( 'css_save', FALSE, 'exists');
$export    = opf_fetch_get( 'export', FALSE, 'exists');
// fetch values from $_POST[]
$filtername = opf_fetch_post( 'name', NULL, 'string');
$funcname   = opf_fetch_post( 'funcname', NULL, 'string');


// check file upload
$upload_message = $upload_ok = ''; // both will be set in upload.php
if(isset($_FILES['filterplugin']) && is_uploaded_file($_FILES['filterplugin']['tmp_name'])) {
        include(dirname(__FILE__).'/upload.php');
}
// export a filter
$export_message = $export_url = ''; // both will be set in export.php
$export_ok = FALSE;
if($export && $id && $doSave) {
        $res = include(dirname(__FILE__).'/export.php');
        if($res) $export_url = $res;
}

// move up or down
if($id && $dir=='up' && $doSave) {
        opf_move_up_one($id);
}
if($id && $dir=='down' && $doSave) {
        opf_move_down_one($id);
}
// toggle active
if($id && $active!==NULL && $doSave){
        opf_set_active($id, $active);
}
// delete userfunc-filter
if($id && $delete && $doSave) {
        opf_unregister_filter($id);
}
// save filter
if(($filtername || $funcname) && $doSave) {
        $tmp = opf_save();
        if(is_numeric($tmp))
                $id = $tmp; // overwrite $id
        // in case we come from add/edit check if user pressed "save" instead of "save and exit"
        if(opf_fetch_post( 'submit_return', FALSE, 'exists'))
                $force_edit = TRUE;
}
// save edited css file
if($css_save && $doSave) {
        if(!empty($_POST))
                opf_css_save();
        // in case we come from add/edit check if user pressed "save" instead of "save and exit"
        if(opf_fetch_post( 'submit_return', FALSE, 'exists'))
                $force_csspath = opf_fetch_post( 'csspath', NULL, 'string');
}


// Now, determine what to do: add filter, edit filter, edit css, open help, show overview

$add     = opf_fetch_get( 'add', FALSE, 'exists');
$edit    = opf_fetch_get( 'edit', FALSE, 'exists');
$csspath = opf_fetch_get( 'csspath', NULL, 'string');
if(isset($force_edit)) $edit = TRUE;
if(isset($force_csspath)) $csspath = $force_csspath;

if($add && $doSave ){ //================================================ add =====

        require(WB_PATH."/modules/$ModDir/add_filter.php");

} elseif($id && $edit && $doSave){ //=================================== edit =====

        require(WB_PATH."/modules/$ModDir/edit_filter.php");

} elseif($id && $csspath && $doSave){ //================================= css =====

        require(WB_PATH."/modules/$ModDir/css.php");

} else { //============================================== admin-tool ==

        // prevent links to be recalled by browser's back-button
        $token =  $admin->getFTAN(false);

        // check if the corefiles are patched
        $patch_applied = opf_check_patched();
        $lang = LANGUAGE;
        if($lang=='NO') $lang = 'NB';
        $docu_patch_url = '/modules/outputfilter_dashboard/docs/files/'.$lang.'/install_opf-txt.html';
        if(!file_exists(WB_PATH.$docu_patch_url))
                $docu_patch_url = '/modules/outputfilter_dashboard/docs/files/'.'EN'.'/install_opf-txt.html';

        // set language for help-browser
        $help_lang = LANGUAGE;
        if($help_lang=='NO') $help_lang = 'NB';
        if(!file_exists("$ModPath/docs/files/".$help_lang.'/intro-txt.html'))
                $help_lang = 'EN';

        // get list of filters for template
        $filterlist = array();
        $types = opf_get_types();
        $filters = opf_select_filters();
        if(!is_array($filters))$filters=array();
        $old_type = ''; // remember last type in foreach below, to draw a separator if type changed
        foreach($filters as $filter) {
                // we need the next str_replace to allow \ ' " in the name for use with javascript
                $filter['name_js_quoted'] = str_replace(array('\\','&#039;','&quot;'), array('\\\\','\\&#039;','\\&quot;'), $filter['name']);
                $filter['desc'] =  opf_fetch_entry_language(unserialize($filter['desc']));
                $filter['helppath'] =  opf_fetch_entry_language(unserialize($filter['helppath']));
                $filter['desc'] = '<small>'.htmlspecialchars(substr($filter['desc'], 0, 40)).'...</small>';
                // mark last added filter
                if($filter['id']==$id)
                        $filter['last_touched'] = TRUE;
                else
                        $filter['last_touched'] = FALSE;
                // line to separate filter-types
                if($old_type!=$filter['type']) {
                        $old_type = $filter['type'];
                        $filter['sep_line'] = TRUE;
                } else {
                        $filter['sep_line'] = FALSE;
                }
                if($filter['active']) {
                        $filter['active_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;active=0&amp;$token";
                } else {
                        $filter['active_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;active=1&amp;$token";
                }
                $filter['edit_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;edit=1&amp;$token";
                if($filter['csspath']!='') {
                        $filter['css_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;csspath=".urlencode($filter['csspath'])."&amp;$token";
                } else {
                        $filter['css_link'] = '';
                }
                if($filter['helppath']) {
                        $filter['helppath_onclick'] = "javascript: return opf_popup('{$filter['helppath']}');";
                } else {
                        $filter['helppath_onclick'] = '';
                }
                if($filter['position']!=0) {
                        $filter['moveup_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;dir=up&amp;$token";
                } else {
                        $filter['moveup_link'] = '';
                }
                if($filter['position']!=opf_get_position_max($filter['type'])) {
                        $filter['movedown_link'] = "$ToolUrl&amp;id={$filter['id']}&amp;dir=down&amp;$token";
                } else {
                        $filter['movedown_link'] = '';
                }
                if($filter['userfunc']||$filter['plugin']) {
                        $filter['delete_link'] = $ToolUrl."&amp;id=".$filter['id']."&amp;delete=1&amp;$token";
                        $filter['export_link'] = $ToolUrl."&amp;id=".$filter['id']."&amp;export=1&amp;$token";
                } else {
                        $filter['delete_link'] = '';
                        $filter['export_link'] = '';
                }
                $filter['type'] = $types[$filter['type']];
                $filterlist[] = $filter;
        }



        // init template
        $tpl = new Template(WB_PATH.'/modules/outputfilter_dashboard');
        $tpl->set_file('page', 'templates/tool.htt');
        $tpl->set_unknowns('keep');

        // fill template vars
        $tpl->set_var(
        array_merge($LANG['MOD_OPF'],
                array(
                //'filterlist' => $filterlist,
                'tpl_add_onclick' => "$ToolUrl&amp;add=1&amp;$token",
                'tpl_upload_url' => "$ToolUrl&amp;$token",
                'tpl_help_onclick' => opf_quotes("javascript: return opf_popup('$ModUrl/docs/files/$help_lang/intro-txt.html');"),
                'tpl_upload_message' => opf_quotes($upload_message),
                'tpl_upload_ok' => $upload_ok,
                'tpl_upload_success' => ($upload_ok==FALSE)?
                                                $LANG['MOD_OPF']['TXT_UPLOAD_FAILED']:
                                                $LANG['MOD_OPF']['TXT_UPLOAD_SUCCESS'],
                'tpl_upload_message_type' => ($upload_ok==FALSE)?'error':'success',
                'tpl_hide_upload' => ($upload_message=='' || $upload_ok==TRUE)?'class="hideupload"':'',
                'tpl_export_message' => opf_quotes($export_message),
                'tpl_export_success' => ($export_ok==FALSE)?
                                                $LANG['MOD_OPF']['TXT_EXPORT_FAILED']:
                                                $LANG['MOD_OPF']['TXT_EXPORT_SUCCESS'],
                'tpl_export_message_type' => ($export_ok==FALSE)?'error':'success',
                'tpl_export_button1' => ($export_ok==FALSE)?$LANG['MOD_OPF']['TXT_OK']:$LANG['MOD_OPF']['TXT_CANCEL'],
                'tpl_export_button2' => ($export_ok==FALSE)?'null':"'".$LANG['MOD_OPF']['TXT_DOWNLOAD']."'",
                'tpl_export_action2' => ($export_ok==FALSE)?'0':opf_quotes($export_url),
                'tpl_export_ok' => $export_ok,
                'tpl_export_url' => opf_quotes($export_url),
                'tpl_tool_url' => opf_quotes($ToolUrl),
                'tpl_patch_applied' => $patch_applied,
                'tpl_patch_corefiles' => sprintf($LANG['MOD_OPF']['TXT_PATCH_COREFILES'], WB_URL.$docu_patch_url),
                'tpl_docu_patch_url' => WB_URL.$docu_patch_url,
                'FTAN' => $admin->getFTAN(),
                'WB_URL' => WB_URL,
                'MOD_URL' => WB_URL.'/modules/'.$module_directory,
                'IMAGE_URL' => WB_URL.'/modules/'.$module_directory.'/templates/images'
        )));


        // if export_message is present parse the export block and store the result in TPL_EXPORT_BLOCK
        if($export_message){
                // Setup template object
                $tpl->set_block('page', 'export_block', 'export');
                $tpl->parse('TPL_EXPORT_BLOCK', 'export_block', false);
                // this is how we could get the result back without substituting it into main_block
                // echo $tpl->get_var('TPL_EXPORT_BLOCK');
        } else { 
                // store empty string otherwise
                $tpl->set_var('TPL_EXPORT_BLOCK', "");
        }


        // if upload_message is present parse the upload block and store the result in TPL_UPLOAD_BLOCK
        if($upload_message){
                $tpl->set_block('page', 'upload_block', 'upload');
                $tpl->parse('TPL_UPLOAD_BLOCK', 'upload_block', false);
        } else { 
                $tpl->set_var('TPL_UPLOAD_BLOCK', "");
        }

        // if the patch is not applied parse the patch block
        if(!$patch_applied){
                $tpl->set_block('page', 'patch_block', 'patch');
                $tpl->parse('TPL_PATCH_BLOCK', 'patch_block', false);
        } else { 
                $tpl->set_var('TPL_PATCH_BLOCK', "");
        }
        
        // construct the table rows for displaying the filter list
        $TPL_FILTER_BLOCK="";
        $tpl->set_block('page', 'filter_block', 'filter');
        $row = 'row_a';
        foreach($filterlist as $filter){
                $row = ($row=='row_b'?'row_a':'row_b');
                $tpl->set_var(array(
                        'tpl_filter_id' => $filter['id'],
                        'tpl_filter_class' => ($filter['last_touched'])?"last-modified":opf_quotes($row),
                        'tpl_filter_active' => ($filter['active'])?"active":"inactive",
                        'tpl_filter_separator' => ($filter['sep_line'])?'class="row-separator"':'',
                        'tpl_filter_activelink' => opf_quotes($filter['active_link']),
                        'tpl_filter_active_inactive' => ($filter['active'])?"active":"inactive",
                        'tpl_filter_on_off' => ($filter['active'])?"on":"off",
                        'tpl_filter_activelink_title' => ($filter['active'])?
                                                                $LANG['MOD_OPF']['TXT_FILTER_ACTIVE']:
                                                                $LANG['MOD_OPF']['TXT_FILTER_INACTIVE'],
                        'tpl_filter_name' => opf_quotes($filter['name']),
                        'tpl_filter_editlink' => opf_quotes($filter['edit_link']),
                        'tpl_filter_type' => ($filter['plugin'])?
                                                        "plugin":(($filter['userfunc'])?
                                                                "inline":"extension"),
                        'tpl_filter_title' => ($filter['plugin'])?
                                                        $LANG['MOD_OPF']["TXT_PLUGIN_FILTER"]:
                                                        (($filter['userfunc'])?
                                                                $LANG['MOD_OPF']["TXT_INLINE_FILTER"]:
                                                                $LANG['MOD_OPF']["TXT_MODULE_EXTENSION_FILTER"]),
                        'tpl_filter_type_txt' => opf_quotes($filter['type']),
                        'tpl_filter_desc' => opf_quotes($filter['desc']),
                        'tpl_filter_help_start' => ($filter['helppath_onclick'])?"":"<!--/*",
                        'tpl_filter_help_end' => ($filter['helppath_onclick'])?"&nbsp;":"*/-->",
                        'tpl_filter_helppath_onclick' => opf_quotes($filter['helppath_onclick']),
                        'tpl_filter_configurl_start' => ($filter['configurl'])?"":"<!--/*",
                        'tpl_filter_configurl_end' => ($filter['configurl'])?"&nbsp;":"*/-->",
                        'tpl_filter_configurl' => opf_quotes($filter['configurl']),
                        'tpl_filter_css_link_start' => ($filter['css_link'])?"":"<!--/*",
                        'tpl_filter_css_link_end' => ($filter['css_link'])?"&nbsp;":"*/-->",
                        'tpl_filter_css_link' => opf_quotes($filter['css_link']),
                        'tpl_filter_moveup_link_start' => ($filter['moveup_link'])?"":"<!--/*",
                        'tpl_filter_moveup_link_end' => ($filter['moveup_link'])?"&nbsp;":"*/-->",
                        'tpl_filter_moveup_link' => opf_quotes($filter['moveup_link']),
                        'tpl_filter_export_link_start' => (($filter['plugin'] || $filter['userfunc']))?
                                                                "":"<!--/*",
                        'tpl_filter_export_link_end' => (($filter['plugin'] || $filter['userfunc']))?
                                                                "&nbsp;":"*/-->",
                        'tpl_filter_export_link' => opf_quotes($filter['export_link']),
                        'tpl_filter_delete_link_start' => ($filter['delete_link'])?"":"<!--/*",
                        'tpl_filter_delete_link_end' => ($filter['delete_link'])?"&nbsp;":"*/-->",
                        'tpl_filter_delete_query' => opf_quotes(
                                "opf_message('"
                                .$LANG['MOD_OPF']["TXT_DELETE_FILTER"]
                                ."', '"
                                .sprintf($LANG['MOD_OPF']['TXT_SURE_TO_DELETE'],$filter['name_js_quoted'])
                                ."', 'query', '"
                                .$LANG['MOD_OPF']["TXT_CANCEL"]
                                ."', '"
                                .$LANG['MOD_OPF']["TXT_OK"]
                                ."', '"
                                .opf_quotes($filter['delete_link'])
                                ."');"
                        ),
                        'tpl_filter_delete_link' => opf_quotes($filter['delete_link']),
                        'tpl_filter_movedown_link_start' => ($filter['movedown_link'])?
                                                                "":"<!--/*",
                        'tpl_filter_movedown_link_end' => ($filter['movedown_link'])?
                                                                "&nbsp;":"*/-->",
                        'tpl_filter_movedown_link' => opf_quotes($filter['movedown_link'])
                ));

                $tpl->parse('TPL_FILTER_BLOCK', 'filter_block', false);
                // obtain the current line and hide the disabled parts
                $TPL_FILTER_BLOCK .= opf_filter_Comments($tpl->get_var('TPL_FILTER_BLOCK'));
        }
        $tpl->set_var('TPL_FILTER_BLOCK', $TPL_FILTER_BLOCK);


        // output template
        $tpl->set_block('page', 'main_block', 'main');
        $tpl->parse('main', 'main_block', false);
        print opf_filter_Comments($tpl->parse('output', 'main', false));
}

if($need_footer) {
 $admin->print_footer();
 exit;
}


