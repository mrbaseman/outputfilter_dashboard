<?php

/*
upgrade.php
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

// load outputfilter-functions
require_once(dirname(__FILE__).'/functions.php');

// obtain module directory
$mod_dir = basename(dirname(__FILE__));
require(WB_PATH.'/modules/'.$mod_dir.'/info.php');

// include module.functions.php 
include_once(WB_PATH . '/framework/module.functions.php');

// load outputfilter-functions
require_once(dirname(__FILE__)."/functions.php");

opf_io_mkdir(__OPF_UPLOAD_DIRNAME);
opf_io_mkdir(WB_PATH.MEDIA_DIRECTORY.'/opf_plugins');

opf_io_unlink($mod_dir.'/debug_config.php');
opf_io_unlink($mod_dir.'/config_init.php');
opf_io_unlink($mod_dir.'/precheck.php');

if(file_exists(WB_PATH.'/modules/practical_module_functions/pmf.php')){
    // load Practical Module Functions
    include_once(WB_PATH.'/modules/practical_module_functions/pmf.php');
    $opf = pmf_init(0, basename(dirname(__FILE__)));

    // unregister this module since we do not use pmf anymore
    pmf_mod_register($opf, basename(dirname(__FILE__)));

}

opf_db_run_query("DROP TABLE IF EXISTS `".TABLE_PREFIX."mod_outputfilter_dashboard_settings`");
