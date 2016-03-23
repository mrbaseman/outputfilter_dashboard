/*
backend_body.js
*/

/**
 *
 * @category        tool
 * @package         Outputfilter Dashboard
 * @version         1.4.9
 * @authors         Thomas "thorn" Hornik <thorn@nettest.thekk.de>, Christian M. Stefan (Stefek) <stefek@designthings.de>, Martin Hecht (mrbaseman) <mrbaseman@gmx.de>
 * @copyright       (c) 2009,2010 Thomas "thorn" Hornik, 2010 Christian M. Stefan (Stefek), 2016 Martin Hecht (mrbaseman)
 * @link            https://github.com/WebsiteBaker-modules/outpufilter_dashboard
 * @link            http://forum.websitebaker.org/index.php/topic,28926.0.html
 * @link            http://forum.wbce.org/viewtopic.php?pid=3121
 * @link            http://addons.wbce.org/pages/addons.php?do=item&item=53
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

$(document).ready(function()
{
// ---| insert jQuery Dialogue CSS & JS Files 
    if($("#dashboard").length) {
       $.insert(WB_URL+"/modules/outputfilter_dashboard/dialog/jquery.dialog.css");
       $.insert(WB_URL+"/modules/outputfilter_dashboard/dialog/jquery.dialog.js");
      } 
// ---| show upload area 
  $("button.show-upload").click(function() {
    $("#upload-panel").slideToggle("fast");
  });
  
// ---| show upload area 
  $("p#close-panel img").click(function() {
    $("#upload-panel").slideToggle("fast");
  });
});


/*
    CheckTree jQuery Plugin - Version 0.22-thorn-1
    original copyright notice see below
    -- changed for use with Website Baker's outputfilter-module. - thorn. Dec, 2008
    ATTN: Special version for use with outputfilter-module only!
          The callback-code isn't updated, so it's possibly broken -- do not use callbacks.
    Added Options:
    allChildrenMarksParentChecked:
        set to "yes" for old behaviour, set to "no" to keep parent on half-checked state (use half-checked as indicator for: some or all childs are set.
    checkedMarksChildrenChecked:
        set to "yes" for old behaviour, set to "no" to keep children unchecked if parent is marked. In this case a parent with checked childs can only be checked or half-checked. Does some more things...
        One may add the class "special_all" to a single <li>-element to add a special "mark-all/unmark-all"-feature.

    Usage:
    $("ul.tree").checkTree_my({labelAction: "check", allChildrenMarksParentChecked: "no", checkedMarksChildrenChecked: "yes"});
    $("ul.tree2").checkTree_my({labelAction: "check", allChildrenMarksParentChecked: "no", checkedMarksChildrenChecked: "no"});

    tree:  check hierarchy to use (that is, the checked page and all sub-pages). Half-checked-state is used to indicate that there are checked sub-pages.
    tree2: check each page to use individually. Half-checked-state is used to indicate that there are checked sub-pages.


Original copyright notice follows:
*/
/**
    Project: CheckTree jQuery Plugin
    Version: 0.22
    Project Website: http://static.geewax.org/checktree/
    Author: JJ Geewax <jj@geewax.org>
    
    License:
    The CheckTree jQuery plugin is currently available for use in all personal or 
    commercial projects under both MIT and GPL licenses. This means that you can choose 
    the license that best suits your project, and use it accordingly.
*/

(function(jQuery) {
jQuery.fn.checkTree_my = function(settings) {
    
    settings = jQuery.extend({
    /* Callbacks
        The callbacks should be functions that take one argument. The checkbox tree
        will return the jQuery wrapped LI element of the item that was checked/expanded.
    */
    onExpand: null,
    onCollapse: null,
    onCheck: null,
    onUnCheck: null,
    onHalfCheck: null,
    onLabelHoverOver: null,
    onLabelHoverOut: null,
    
    /* Valid choices: 'expand', 'check' */
    labelAction: "expand",
    allChildrenMarksParentChecked: "yes",
    checkedMarksChildrenChecked: "yes",
                
    // Debug (currently does nothing)
    debug: false
    }, settings);
    
    var $tree = this;
    
    $tree.find("li")
    
    // Hide all checkbox inputs
    .find(":checkbox")
        .change(function() {
        // Fired when the children of this checkbox have changed.
        // Children can change the state of a parent based on what they do as a group.
        var $all = jQuery(this).siblings("ul").find(":checkbox");
        var $checked = $all.filter(":checked");
        
        // All children are checked
        if ($all.length == $checked.length) {
            if(settings.allChildrenMarksParentChecked=="yes") {
            if(settings.checkedMarksChildrenChecked=="yes") {
                jQuery(this).prop("checked", true).siblings(".checkbox").removeClass("half_checked").addClass("checked");
            } else {
                jQuery(this).prop("checked", true).siblings(".checkbox").removeClass("half_checked").addClass("checked");
            }
            } else {
            if(settings.checkedMarksChildrenChecked=="yes") {
                jQuery(this).siblings(".checkbox").not(".checked").addClass("half_checked");
            } else {
                jQuery(this).siblings(".checkbox").not(".checked").addClass("half_checked");
            }
            }
            // Fire parent's onCheck callback
            if (settings.onCheck) settings.onCheck(jQuery(this).parent());
        }
        // All children are unchecked
        else if($checked.length == 0) {
            if(settings.checkedMarksChildrenChecked=="yes") {
            jQuery(this).prop("checked", false).siblings(".checkbox").removeClass("checked").removeClass("half_checked");
            } else {
            jQuery(this).siblings(".checkbox").not("checked").prop("checked", false).removeClass("half_checked");    
            }
            // Fire parent's onUnCheck callback
            if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
        }
        
        // Some children are checked, makes the parent in a half checked state.
        else { 
            // Fire parent's onHalfCheck callback only if it's going to change
            if (settings.onHalfCheck && !jQuery(this).siblings(".checkbox").hasClass("half_checked"))
            settings.onHalfCheck(jQuery(this).parent());
            if(settings.checkedMarksChildrenChecked=="yes" || jQuery(this).hasClass("special_all")) {
            jQuery(this).prop("checked", false).siblings(".checkbox").removeClass("checked").addClass("half_checked");
            } else {
            jQuery(this).siblings(".checkbox").not(".checked").prop("checked", false).addClass("half_checked");
            }
        }
        })
        .hide()
    .end()
    
    .each(function() {
        
        // Go through and hide only ul's (subtrees) that do not have a sibling div.expanded:
        // We do this to not collapse *all* the subtrees (if one is open and checkTree is called again)
        jQuery(this).find("ul").each(function() {
        if (!jQuery(this).siblings(".expanded").length) jQuery(this).hide();
        });
        
        // Copy the label
        var $label = jQuery(this).children("label").clone();
        // Create or the image for the checkbox next to the label
        var $checkbox = jQuery('<div class="checkbox"></div>');
        // Create the image for the arrow (to expand and collapse the hidden trees)
        var $arrow = jQuery('<div class="arrow"></div>');
        
        // If the li has children:
        if (jQuery(this).is(":has(ul)")) {
        // If the subtree is not visible, make the arrow collapsed. Otherwise expanded.
        if (jQuery(this).children("ul").is(":hidden")) $arrow.addClass("collapsed");
        else $arrow.addClass("expanded");
        
        // When you click the image, toggle the child list
        $arrow.click(function() {
            jQuery(this).siblings("ul").toggle();
            
            // Swap the classes: expanded <-> collapsed and fire the onExpand/onCollapse events
            if (jQuery(this).hasClass("collapsed")) {
            jQuery(this)
                .addClass("expanded")
                .removeClass("collapsed")
            ;
            if (settings.onExpand) settings.onExpand(jQuery(this).parent());
            }
            else {
            jQuery(this)
                .addClass("collapsed")
                .removeClass("expanded")
            ;
            if (settings.onCollapse) settings.onCollapse(jQuery(this).parent());
            }
        });
        }
        
        // When you click the checkbox, it should do the checking/unchecking
        $checkbox.click(function() {
        // Toggle the checked class)
        if(settings.checkedMarksChildrenChecked=="no" && !jQuery(this).siblings("input").hasClass("special_all") && jQuery(this).hasClass("checked") && jQuery(this).siblings("ul").find(".checkbox").is(".checked")==true) {
            jQuery(this).removeClass("checked").addClass("half_checked").siblings(":checkbox").prop("checked", false)
        } else {
            jQuery(this)
            .toggleClass("checked")
            // if it's half checked, its now either checked or unchecked
            .removeClass("half_checked")
            // Send a click event to the checkbox to toggle it as well
            // (this is the actual input element)
            .siblings(":checkbox").prop("checked",jQuery(this).hasClass("checked"));
        }
        // Check/uncheck children depending on our status.
        if(settings.checkedMarksChildrenChecked=="yes" || jQuery(this).siblings("input").hasClass("special_all")) {
            if (jQuery(this).hasClass("checked")) {
            // Fire the check callback for this parent
            if (settings.onCheck) settings.onCheck(jQuery(this).parent());
            
            // Go to the sibling list, and find all unchecked checkbox images
            jQuery(this).siblings("ul").find(".checkbox").not(".checked")
            // Set as fully checked:
            .removeClass("half_checked")
            .addClass("checked")
            
            // For each one, fire the onCheck callback
            .each(function() {
                if (settings.onCheck) settings.onCheck(jQuery(this).parent());
            })
            
            // For each one, check the checkbox (actual input element)
            .siblings(":checkbox")
                .prop("checked", true)
            ;
          }
        
          // If Unchecked:
          else {
            // Fire the uncheck callback for this parent
            if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
            
            // Go to the sibling list and find all checked checkbox images
            jQuery(this).siblings("ul").find(".checkbox").filter(".checked")
            // Set as fully unchecked
            .removeClass("half_checked")
            .removeClass("checked")
            
            // For each one fire the onUnCheck callback
            .each(function() {
                if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
            })
            
            // For each one, uncheck the checkbox (the actual input element)
            .siblings(":checkbox")
                .prop("checked", false)
            ;
          }
           }
                                
        // Tell our parent checkbox that we've changed (they might need to change their state)
        jQuery(this).parents("ul").siblings(":checkbox").change();
        });
        
        // Add the appropriate classes to the new checkbox image based on the old one:
        if (jQuery(this).children('.checkbox').hasClass('checked'))
        $checkbox.addClass('checked');
        else if (jQuery(this).children(':checkbox').prop("checked")) {
        $checkbox.addClass('checked');
        jQuery(this).parents("ul").siblings(":checkbox").change()
        }
        else if (jQuery(this).children('.checkbox').hasClass('half_checked'))
        $checkbox.addClass('half_checked');
        
        // Remove any existing arrows or checkboxes or labels
        jQuery(this).children(".arrow").remove();
        jQuery(this).children(".checkbox").remove();
        jQuery(this).children("label").remove();
        
        // Prepend the new arrow, label, and checkbox images to the front of the LI
        jQuery(this)
        .prepend($label)
        .prepend($checkbox)
        .prepend($arrow)
        ;
    })
    
    .find("label")
        // Clicking the labels should do the labelAction (either expand or check)
        .click(function() {
        var action = settings.labelAction;
        switch(settings.labelAction) {
            case 'expand':
            jQuery(this).siblings(".arrow").click();
            break;
            case 'check':
            jQuery(this).siblings(".checkbox").click();
            break;
        }
        })
        
        // Add a hover class to the labels when hovering
        .hover(
        function() { 
            jQuery(this).addClass("hover");
            if (settings.onLabelHoverOver) settings.onLabelHoverOver(jQuery(this).parent());
        },
        function() {
            jQuery(this).removeClass("hover");
            if (settings.onLabelHoverOut) settings.onLabelHoverOut(jQuery(this).parent());
        }
        )
    .end()
    ;

    return $tree;
};
})(jQuery);



/**
 * jQuery custom checkboxes
 * 
 * Copyright (c) 2008 Khavilo Dmitry (http://widowmaker.kiev.ua/checkbox/)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.3.0 Beta
 * @author Khavilo Dmitry
 * @mailto wm.morgun@gmail.com
**/
(function($){var i=function(e){if(!e)var e=window.event;e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation()};$.fn.checkbox=function(f){try{document.execCommand('BackgroundImageCache',false,true)}catch(e){}var g={cls:'jquery-checkbox',empty:'empty.png'};g=$.extend(g,f||{});var h=function(a){var b=a.checked;var c=a.disabled;var d=$(a);if(a.stateInterval)clearInterval(a.stateInterval);a.stateInterval=setInterval(function(){if(a.disabled!=c)d.trigger((c=!!a.disabled)?'disable':'enable');if(a.checked!=b)d.trigger((b=!!a.checked)?'check':'uncheck')},10);return d};return this.each(function(){var a=this;var b=h(a);if(a.wrapper)a.wrapper.remove();a.wrapper=$('<span class="'+g.cls+'"><span class="mark"><img src="'+g.empty+'" /></span></span>');a.wrapperInner=a.wrapper.children('span:eq(0)');a.wrapper.hover(function(e){a.wrapperInner.addClass(g.cls+'-hover');i(e)},function(e){a.wrapperInner.removeClass(g.cls+'-hover');i(e)});b.css({position:'absolute',zIndex:-1,visibility:'hidden'}).after(a.wrapper);var c=false;if(b.attr('id')){c=$('label[for='+b.attr('id')+']');if(!c.length)c=false}if(!c){c=b.closest?b.closest('label'):b.parents('label:eq(0)');if(!c.length)c=false}if(c){c.hover(function(e){a.wrapper.trigger('mouseover',[e])},function(e){a.wrapper.trigger('mouseout',[e])});c.click(function(e){b.trigger('click',[e]);i(e);return false})}a.wrapper.click(function(e){b.trigger('click',[e]);i(e);return false});b.click(function(e){i(e)});b.bind('disable',function(){a.wrapperInner.addClass(g.cls+'-disabled')}).bind('enable',function(){a.wrapperInner.removeClass(g.cls+'-disabled')});b.bind('check',function(){a.wrapper.addClass(g.cls+'-checked')}).bind('uncheck',function(){a.wrapper.removeClass(g.cls+'-checked')});$('img',a.wrapper).bind('dragstart',function(){return false}).bind('mousedown',function(){return false});if(window.getSelection)a.wrapper.css('MozUserSelect','none');if(a.checked)a.wrapper.addClass(g.cls+'-checked');if(a.disabled)a.wrapperInner.addClass(g.cls+'-disabled')})}})(jQuery);



/*
 * jQuery Growfield Library 2
 *
 * http://code.google.com/p/jquery-dynamic/
 * licensed under the MIT license
 *
 * autor: john kuindji
 */
(function(C){if(C.support==undefined){C.support={boxModel:C.boxModel}}var A=false;C(window).one("load",function(){A=true});C.fx.prototype.originalUpdate=C.fx.prototype.update;C.fx.prototype.update=false;C.fx.prototype.update=function(){if(!this.options.inline){return this.originalUpdate.call(this)}if(this.options.step){this.options.step.call(this.elem,this.now,this)}(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this)};var B=function(D){this.dom=D;this.o=C(D);this.opt={auto:true,animate:100,easing:null,min:false,max:false,restore:false,step:false};this.enabled=this.dummy=this.busy=this.initial=this.sizeRelated=this.prevH=this.firstH=false};B.prototype={toggle:function(D){if((D=="disable"||D===false)&&this.enabled){return this.setEvents("off")}if((D=="enable"||D===true)&&!this.enabled){return this.setEvents("on")}return this},setEvents:function(I){var H=this.o,E=this.opt,G=this,D=false;if(I=="on"&&!this.enabled){var F=H.height()==0?true:false;if(!F||A){C(function(){G.prepareSizeRelated()})}else{C(window).one("load",function(){G.prepareSizeRelated()})}if(E.auto){H.bind("keyup.growfield",function(J){G.keyUp(J);return true});H.bind("focus.growfield",function(J){G.focus(J);return true});H.bind("blur.growfield",function(J){G.blur(J);return true});D={overflow:H.css("overflow"),cssResize:H.css("resize")};if(C.browser.safari){H.css("resize","none")}this.initial=D;H.css({overflow:"hidden"});if(!F||A){C(function(){G.createDummy()})}else{C(window).one("load",function(){G.createDummy()})}}else{H.bind("keydown.growfield",function(J){G.manualKeyUp(J);return true});H.css("overflow-y","auto");if(!F||A){C(function(){G.update(H.height())})}else{C(window).one("load",function(){G.update(H.height())})}}H.addClass("growfield");this.enabled=true}else{if(I=="off"&&this.enabled){if(this.dummy){this.dummy.remove();this.dummy=false}H.unbind(".growfield").css("overflow",this.initial.overflow);if(C.browser.safari){H.css("resize",this.initial.cssResize)}this.enabled=false}}return this},setOptions:function(D){var E=this.opt,F=this.o;C.extend(E,D);if(!C.easing){E.easing=null}},update:function(N,G){var D=this.sizeRelated,J=this.o.val(),F=this.opt,M=this.dom,H=this.o,E=this,K=this.prevH;var I=!F.auto,L=F.auto;N=this.convertHeight(Math.round(N),"inner");N=F.min>N?F.min:F.max&&N>F.max?F.max:F.auto&&!J?F.min:N;if(F.max&&F.auto){if(K!=F.max&&N==F.max){H.css("overflow-y","scroll");if(!F.animate){H.focus()}I=true;L=false}if(K==F.max&&N<F.max){H.css("overflow-y","hidden");if(!F.animate){H.focus()}L=false}}if(N==K){return true}this.prevH=N;if(G){E.busy=true;H.animate({height:N},{duration:F.animate,easing:F.easing,overflow:null,inline:true,complete:function(){if(!I){H.css("overflow","hidden")}if(!L){H.focus()}E.busy=false},queue:false})}else{M.style.height=N+"px"}},manualKeyUp:function(D){if(!D.ctrlKey){return }if(D.keyCode!=38&&D.keyCode!=40){return }this.update(this.o.outerHeight()+(this.opt.step*(D.keyCode==38?-1:1)),this.opt.animate)},keyUp:function(D){if(this.busy){return true}if(C.inArray(D.keyCode,[37,38,39,40])!=-1){return true}this.update(this.getDummyHeight(),this.opt.animate)},focus:function(D){if(this.busy){return true}if(this.opt.restore){this.update(this.getDummyHeight(),this.opt.animate)}},blur:function(D){if(this.busy){return true}if(this.opt.restore){this.update(0,false)}},getDummyHeight:function(){var G=this.o.val(),E=0,D=this.sizeRelated,F="\n111\n111";if(C.browser.safari){G=G.substring(0,G.length-1)}if(!D.lh||!D.fs){G+=F}this.dummy.val(G);if(C.browser.msie){this.dummy[0].style.height=this.dummy[0].scrollHeight+"px"}E=this.dummy[0].scrollHeight;if(D.lh&&D.fs){E+=D.lh>D.fs?D.lh+D.fs:D.fs*2}if(C.browser.msie){this.dummy[0].style.height="20px"}return E},createDummy:function(){var F=this.o,E=this.o.val();var D=F.clone().addClass("growfieldDummy").attr("name","").attr("tabindex",-9999).css({position:"absolute",left:-9999,top:0,height:"20px",resize:"none"}).insertBefore(F).show();if(!E){D.val("dummy text")}this.dummy=D;this.update(!jQuery.trim(E)?0:this.getDummyHeight(),false)},convertHeight:function(F,H){var E=this.sizeRelated,D=(H=="inner"?-1:1),G=C.support.boxModel;return F+(G?E.bt:0)*D+(G?E.bb:0)*D+(G?E.pt:0)*D+(G?E.pb:0)*D},prepareSizeRelated:function(){var F=this.o,D=this.opt;if(!D.min){D.min=parseInt(F.css("min-height"),10)||this.firstH||parseInt(F.height(),10)||20;if(D.min<=0){D.min=20}if(!this.firstH){this.firstH=D.min}}if(!D.max){D.max=parseInt(F.css("max-height"),10)||false;if(D.max<=0){D.max=false}}if(!D.step){D.step=parseInt(F.css("line-height"),10)||parseInt(F.css("font-size"),10)||20}var E={pt:parseInt(F.css("paddingTop"),10)||0,pb:parseInt(F.css("paddingBottom"),10)||0,bt:parseInt(F.css("borderTopWidth"),10)||0,bb:parseInt(F.css("borderBottomWidth"),10)||0,lh:parseInt(F.css("lineHeight"),10)||false,fs:parseInt(F.css("fontSize"),10)||false};this.sizeRelated=E}};C.fn.growfield=function(D){if("destroy"==D){return this.each(function(){var F=C(this).data("growfield");if(F==undefined){return true}F.toggle(false);C(this).removeData("growfield");return true})}if("restart"==D){return this.each(function(){var F=C(this).data("growfield");if(F==undefined){return true}F.toggle(false).toggle(true)})}var E=typeof D;return this.each(function(){if(!/textarea/i.test(this.tagName)||C(this).hasClass("growfieldDummy")){return true}var F=false,J=C(this),H=J.data("growfield");if(H==undefined){F=true;J.data("growfield",new B(this));H=J.data("growfield")}if(F){var G=C.extend({},C.fn.growfield.defaults,D);H.setOptions(G)}if(!F&&(!D||E=="object")){H.setOptions(D)}if(E=="string"){if(D.indexOf("!")==0&&C.fn.growfield.presets[D.substr(1)]){J.unbind("."+i+"."+D.substr(1))}else{if(C.fn.growfield.presets[D]){var I=C.fn.growfield.presets[D];H.setOptions(I,D)}}}if(F&&!G.skipEnable){H.toggle(true)}if(!F&&(E=="boolean"||D=="enable"||D=="disable")){H.toggle(D)}})};C.fn.growfield.defaults={};C.fn.growfield.presets={}})(jQuery);


/*
    local functions
*/


/* activate CheckTree */
if(typeof opf_use_checktrees!='undefined') {
    $("ul.tree1").checkTree_my({labelAction: "check", allChildrenMarksParentChecked: "yes", checkedMarksChildrenChecked: "yes"});
    $("ul.tree2").checkTree_my({labelAction: "check", allChildrenMarksParentChecked: "yes", checkedMarksChildrenChecked: "yes"});
    
    //modules_checktree_visibility();
    $("input[class=activity]").checkbox({ cls:"activity", empty: WB_URL+"/modules/outputfilter_dashboard/templates/images/empty.gif"});
    
}



function modules_checktree_visibility() {
    i = document.outputfilter.type.selectedIndex;
    if(document.outputfilter.type.options[i].value == '7page' || document.outputfilter.type.options[i].value == '8page_last') {
        document.getElementById('OPF_ID_CHECKTREE').style.display = 'none';
        document.getElementById('OPF_ID_SEC_DESC').style.display = 'none';
        document.getElementById('OPF_ID_SEC_DESC_2').style.display = 'none';
        document.getElementById('OPF_ID_PAGE_DESC').style.display = '';
        document.getElementById('OPF_ID_PAGE_DESC_2').style.display = '';
    } else {
        document.getElementById('OPF_ID_CHECKTREE').style.display = '';
        document.getElementById('OPF_ID_SEC_DESC').style.display = '';
        document.getElementById('OPF_ID_SEC_DESC_2').style.display = '';
        document.getElementById('OPF_ID_PAGE_DESC').style.display = 'none';
        document.getElementById('OPF_ID_PAGE_DESC_2').style.display = 'none';
    }
}



/* activate EditArea */
if(typeof opf_use_css_editarea!='undefined') {
    editAreaLoader.init({ id : "css", syntax: "css", start_highlight: true });
}
if(typeof opf_editarea!='undefined') {
    if(opf_editarea=='editable')
        editAreaLoader.init({ id : "func", syntax: "php", start_highlight: true });
    else
        editAreaLoader.init({ id : "func", syntax: "php", start_highlight: true, is_editable: false });
}
if(typeof opf_editarea_list!='undefined') {for(var i in opf_editarea_list) {editAreaLoader.init({ id : opf_editarea_list[i], syntax: "php", start_highlight: true });}}


/* activate GrowField */
$("#desc").growfield();
if(typeof opf_growfield_list!='undefined') {
    for(var i in opf_growfield_list) {
        $("#"+opf_growfield_list[i]).growfield();
    }
}



/* popup-window */
function opf_popup(url) {
 w = window.open(url, "OutputFilter-Dashboard Documentation", "width=1024,height=768,resizable=yes,scrollbars=yes");
 w.focus();
 return false;
}


if(typeof document.outputfilter!='undefined') {
    if(typeof document.outputfilter.type!='undefined') {
        // display text-block for page-type or section-type, and module-checktree
        modules_checktree_visibility();
        // display page-checktree
        document.getElementById('OPF_ID_PAGECHECKTREE').style.display = '';
    }
}



