/*!
 * HelperPicker v1.0.2
 * https://github.com/tshi0912/helperpicker
 *
 * Copyright (c) 2015-2016 Tao Shi
 * Released under the MIT license
 *
 * Date: 2016-03-17T07:47:48.063Z
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery', 'ChineseDistricts'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'), require('ChineseDistricts'));
    } else {
        // Browser globals.
        factory(jQuery, ChineseDistricts);
    }
})(function ($, ChineseDistricts) {

    'use strict';

    if (typeof ChineseDistricts === 'undefined') {
        throw new Error('The file "city-picker.data.js" must be included first!');
    }

    var NAMESPACE = 'helperpicker';
    var EVENT_CHANGE = 'change.' + NAMESPACE;
    var PROVINCE = 'province';
    var CITY = 'city';
    var DISTRICT = 'district';

    function HelperPicker(element, options) {
        this.$element = $(element);
        this.$dropdownHtml =  $(element).next().html();
        this.$dropdown = null;
        this.options = $.extend({}, HelperPicker.DEFAULTS, $.isPlainObject(options) && options);
        this.active = false;
        this.dems = [];
        this.needBlur = false;
        this.init();
    }


    HelperPicker.prototype = {
        constructor: HelperPicker,

        init: function () {

            this.defineDems();

            this.render();

            this.bind();

            //if(this.options.open){
            //    this.open();
            //}

            this.active = true;
        },

        render: function () {
            var p = this.getPosition(),
                placeholder = this.$element.attr('placeholder') || this.options.placeholder,
                //textspan = '<span class="city-picker-span" style="' +
                //    this.getWidthStyle(p.width) + 'height:' +
                //    p.height + 'px;line-height:' + (p.height - 1) + 'px;">' +
                //    (placeholder ? '<span class="placeholder">' + placeholder + '</span>' : '') +
                //    '<span class="title"></span><div class="arrow"></div>' + '</span>',

                dropdown = '<div class="city-picker-dropdown" style="left:0px;top:100%;' +
                    this.getWidthStyle(p.tableWidth, true) + '">' +
                    '<div class="city-select-wrap">' +
                    this.$dropdownHtml +
                    '</div></div>';

            //this.$element.addClass('city-picker-input');
            //this.$textspan = $(textspan).insertAfter(this.$element);
            this.$dropdown = $(dropdown).insertAfter(this.$element);
            //var $select = this.$dropdown.find('.city-select');
            //
            //// setup this.$province, this.$city and/or this.$district object
            //$.each(this.dems, $.proxy(function (i, type) {
            //    this['$' + type] = $select.filter('.' + type + '');
            //}, this));

            this.refresh();
        },

        refresh: function (force) {
            // clean the data-item for each $select
            //var $select = this.$dropdown.find('.city-select');
            //$select.data('item', null);
            //// parse value from value of the target $element
            //var val = this.$element.val() || '';
            //val = val.split('/');
            //$.each(this.dems, $.proxy(function (i, type) {
            //    if (val[i] && i < val.length) {
            //        this.options[type] = val[i];
            //    } else if (force) {
            //        this.options[type] = '';
            //    }
            //    this.output(type);
            //}, this));
            //this.tab(PROVINCE);
            this.feedText();
            this.feedVal();
        },

        defineDems: function () {
            var stop = false;
            $.each([PROVINCE, CITY, DISTRICT], $.proxy(function (i, type) {
                if (!stop) {
                    this.dems.push(type);
                }
                if (type === this.options.level) {
                    stop = true;
                }
            }, this));
        },

        includeDem: function (type) {
            return $.inArray(type, this.dems) !== -1;
        },

        getPosition: function () {
            var p, h, w, s, pw;
            p = this.$element.position();
            s = this.getSize(this.$element);
            h = s.height;
            w = s.width;
            if (this.options.responsive) {
                pw = this.$element.offsetParent().width();
                if (pw) {
                    w = w / pw;
                    if (w > 0.99) {
                        w = 1;
                    }
                    w = w * 100 + '%';
                }
            }
            var tw = 680;

            return {
                top: p.top || 0,
                left: p.left || 0,
                height: h,
                width: w,
                tableWidth:'80%'
                //tableWidth:Math.min(680, tw)
            };
        },

        getSize: function ($dom) {
            var $wrap, $clone, sizes;
            if (!$dom.is(':visible')) {
                $wrap = $("<div />").appendTo($("body"));
                $wrap.css({
                    "position": "absolute !important",
                    "visibility": "hidden !important",
                    "display": "block !important"
                });

                $clone = $dom.clone().appendTo($wrap);

                sizes = {
                    width: $clone.outerWidth(),
                    height: $clone.outerHeight()
                };

                $wrap.remove();
            } else {
                sizes = {
                    width: $dom.outerWidth(),
                    height: $dom.outerHeight()
                };
            }

            return sizes;
        },

        getWidthStyle: function (w, dropdown) {
            if (this.options.responsive && !$.isNumeric(w)) {
                return 'width:' + w + ';';
            } else {
                return 'width:' + (dropdown ? Math.max(320, w) : w) + 'px;';
            }
        },

        bind: function () {
            var $this = this;

            $(document).on('click', (this._mouteclick = function (e) {
                var $target = $(e.target);
                var $dropdown, $span, $input;
                if ($target.is('.city-picker-span')) {
                    $span = $target;
                } else if ($target.is('.city-picker-span *')) {
                    $span = $target.parents('.city-picker-span');
                }
                if ($target.is('.city-picker-input')) {
                    $input = $target;
                }
                if ($target.is('.city-picker-dropdown')) {
                    $dropdown = $target;
                } else if ($target.is('.city-picker-dropdown *')) {
                    $dropdown = $target.parents('.city-picker-dropdown');
                }

                //if($this.$textspan.is('.open')){
                //    if ((!$input && !$span && !$dropdown) ||
                //        ($span && $span.get(0) !== $this.$textspan.get(0)) ||
                //        ($input && $input.get(0) !== $this.$element.get(0)) ||
                //        ($dropdown && $dropdown.get(0) !== $this.$dropdown.get(0))) {
                //        $this.close(true);
                //    }
                //}

            }));

            this.$element.on('change', (this._changeElement = $.proxy(function () {
                this.close(true);
                this.refresh(true);
            }, this))).on('focus', (this._focusElement = $.proxy(function () {
                this.needBlur = true;
                this.open();
            }, this))).on('blur', (this._blurElement = $.proxy(function () {
                if (this.needBlur) {
                    this.needBlur = false;
                    this.close(true);
                }
            }, this)));

            //this.$textspan.on('click', function (e) {
            //    var $target = $(e.target), type;
            //    $this.needBlur = false;
            //    if ($target.is('.select-item')) {
            //        type = $target.data('count');
            //        $this.open(type);
            //    } else {
            //        if ($this.$dropdown.is(':visible')) {
            //            $this.close();
            //        } else {
            //            $this.open();
            //        }
            //    }
            //}).on('mousedown', function () {
            //    $this.needBlur = false;
            //});

            this.$dropdown.on('click', '.city-select a', function () {
                var $a = $(this);
                var helperIndex = $a.attr("helper-index")
                var $button  =  $a.parents('.city-picker-dropdown:first').prev();
                var targetId  = JSON.parse($button.attr("action"))["componentControl"]["targetId"]
                var $targetComponent = $button.parents(".hfcontainer:first").find("div[dc='" + targetId + "']:first");
                if($targetComponent.children().is("[component=flatContainer]")){
                    if($targetComponent.find(".helper-div").length - 1  < helperIndex) {
                        $.post("/getFileEditorHelperData.html",{helperIndex:helperIndex, targetId:targetId},function(data){
                            // if(data.resultCode != '0') {
                            //     alert(data.resultMessage);
                            //     return;
                            // }
                            var $fastObj = $(data);
                            $fastObj.removeClass("helper-div");
                            $fastObj.show();
                            $targetComponent.find("div.box-content:first").append($fastObj);
                            flatContainerStyleReset($fastObj);
                            if(helperItemAddInitial) {
                                helperItemAddInitial($fastObj);
                            }
                            $.reloadDisplay($fastObj);

                            var input = $targetComponent.find("div[dc='" + targetId + "']:first form").serialize()
                            if(!(input + "&").match("=[^=&]+&")){
                                $targetComponent.find(".box-content:first .row-fluid:first").remove();
                            }
                        });
                    }else {
                        var $fastObj = $targetComponent.find(".helper-div").eq(helperIndex).clone();
                        $fastObj.removeClass("helper-div");
                        $fastObj.show();
                        $targetComponent.find(".helper-div").eq(helperIndex).after($fastObj)
                        $.reloadDisplay($fastObj);
                        var input = $targetComponent.find("div[dc='" + targetId + "']:first form").serialize()
                        if(!(input + "&").match("=[^=&]+&")){
                            $targetComponent.find(".box-content:first .row-fluid:first").remove();
                        }
                    }

                }else {
                    var $helperTR = $targetComponent.find(".hflist:first .box-content .hflist-fast-data tr").eq(helperIndex);
                    var $newTR = $helperTR.clone();
                    $($helperTR).find("select").each(function(i){
                        $($newTR).find("select").eq(i).val($(this).val());
                    });
                    $($newTR).find(".hfselectx").each(function(i){
                        $(this).next().remove();
                        $(this).show();
                        $(this).chosen();//����Ϊselectx
                    });

                    $($newTR).find(".hfcheckbox input").uniform();
                    $newTR.find("input[data-toggle='component-picker']").each(function(){
                        $(this).nextAll().remove();
                        $(this).componentpicker();
                    });
                    $targetComponent.find(".hflist:first .box-content .hflist-data:first").append($newTR);

                    $.reloadDisplay($newTR);
                    if(helperItemAddInitial) {
                        helperItemAddInitial($newTR);
                    }
                    var $headTR = $targetComponent.find(".hflist:first .box-content .hflist-data tr:first");
                    $("#GLOBAL_TEMP_FORM").html($headTR.html());

                    if(!($("#GLOBAL_TEMP_FORM").serialize() + "&").match("=[^=&]+&")){
                        $headTR.remove()
                    }
                }

                if($targetComponent.is(":hidden")) {
                    $targetComponent.show();
                }

                var $select = $(this).parents('.city-select');
                var $active = $select.find('a.active');
                var last = $select.next().length === 0;
                $active.removeClass('active');
                $(this).addClass('active');
                if ($active.data('code') !== $(this).data('code')) {
                    $select.data('item', {
                        address: $(this).attr('title'), code: $(this).data('code')
                    });
                    $(this).trigger(EVENT_CHANGE);
                    $this.feedText();
                    $this.feedVal(true);
                    if (last) {
                        // mod by zqh
                        //alert($this.getVal());
                        //var assignDom = document.querySelector('#'+this.options.assign);  //input DOM
                        var event = document.createEvent('HTMLEvents'); //创建事件
                        event.initEvent("input", true, true); //设置事件类型为 input
                        console.info($this.$element.get(0));
                        $this.$element.get(0).dispatchEvent(event); //触发下 该事件（input 事件）
                        $this.close();
                    }
                }
            }).on('mousedown', function () {
                $this.needBlur = false;
            });

            if (this.$province) {
                this.$province.on(EVENT_CHANGE, (this._changeProvince = $.proxy(function () {
                    this.output(CITY);
                    this.output(DISTRICT);
                    this.tab(CITY);
                }, this)));
            }

            if (this.$city) {
                this.$city.on(EVENT_CHANGE, (this._changeCity = $.proxy(function () {
                    this.output(DISTRICT);
                    this.tab(DISTRICT);
                }, this)));
            }
        },

        open: function (type) {
            type = type || PROVINCE;
            var relComponentDC  = JSON.parse(this.$element.attr("action"))["componentControl"]["targetId"]
            var content = $("[dc='" + relComponentDC + "_helpTag']").html();
            this.$dropdown.children().html(content);

            if(this.$element.val() && this.$element.val() != "") {
                var $emptyTr = this.$dropdown.find(" .hflist .table tbody tr:first");
                var subData = JSON.parse(this.$element.val())
                for(var index in subData){
                    if(index > 0) {
                        $emptyTr.after($emptyTr.clone());
                        $emptyTr = $emptyTr.next();
                    }
                    for(var key in subData[index]){
                        var value = subData[index][key];
                        var $childElement = $emptyTr.find("[name='" + key + "']")
                        if($childElement.is('select')) {
                            $childElement.val(value);
                        }else if($childElement.hasClass("hfcheckbox") || $childElement.hasClass("hfradio") ) {
                            $childElement.val(value);
                        }else {
                            $childElement.val(value);
                        }
                    }
                }
            }


            this.$dropdown.show();
            //this.$textspan.addClass('open').addClass('focus');
            this.tab(type);
        },

        close: function (blur) {
            this.$dropdown.hide();
            //this.$textspan.removeClass('open');
            //if (blur) {
            //    this.$textspan.removeClass('focus');
            //}

            $("#GLOBAL_TEMP_FORM").html(this.$dropdown.find(".table"));
            this.$element.val($("#GLOBAL_TEMP_FORM").serializeJson());
            this.feedText();
            this.feedVal();
            this.$dropdown.children().html("");
            //this.$element.val(this.$dropdown.children().html());
            //this.$textspan.text(this.$dropdown.children().html())
        },



        unbind: function () {

            $(document).off('click', this._mouteclick);

            this.$element.off('change', this._changeElement);
            this.$element.off('focus', this._focusElement);
            this.$element.off('blur', this._blurElement);

            //this.$textspan.off('click');
            //this.$textspan.off('mousedown');

            this.$dropdown.off('click');
            this.$dropdown.off('mousedown');

            if (this.$province) {
                this.$province.off(EVENT_CHANGE, this._changeProvince);
            }

            if (this.$city) {
                this.$city.off(EVENT_CHANGE, this._changeCity);
            }
        },

        getText: function () {
            //var values = this.getVal();
            ////TODO
            //if(values == '[{}]' || values == '' || !values){
            //    return "无";
            //}
            //var relComponentDC  = this.$element.attr("data-code");
            //var $emptyTr = $("[dc='" + relComponentDC + "']").find(" .hflist .table tbody tr:first");
            //var subData = JSON.parse(values);
            //var text = "";
            //for(var index in subData){
            //    for(var key in subData[index]){
            //        var value = subData[index][key];
            //        if(value) {
            //            var $childElement = $emptyTr.find("[name='" + key + "']")
            //            if($childElement.is('select')) {
            //                if($childElement.find("option[value='" + value + "']")) {
            //                    text = text + $childElement.find("option[value='" + value + "']").html() + "|";
            //                }else {
            //                    text = text + "无" + "|";
            //                }
            //
            //            }else if($childElement.hasClass("hfcheckbox") || $childElement.hasClass("hfradio") ) {
            //                text = text + value + "|";
            //            }else {
            //                text = text + value + "|";
            //            }
            //        }
            //    }
            //    if(text && text.length > 0) {
            //        text = text.substring(0, text.length -1) + ", "
            //    }
            //
            //}
            //if(!text){
            //    text = "无"
            //}
            //return text;
            //return this.$dropdown.children().html();
        },

        getPlaceHolder: function () {
            return this.$element.attr('placeholder') || this.options.placeholder;
        },

        feedText: function () {
            //var text = this.getText();
            //if (text) {
            //    this.$textspan.find('>.placeholder').hide();
            //    this.$textspan.find('>.title').html(this.getText()).show();
            //} else {
            //    this.$textspan.find('>.placeholder').text(this.getPlaceHolder()).show();
            //    this.$textspan.find('>.title').html('').hide();
            //}
        },

        getVal: function () {
            //return this.$element.val();
            //$("#GLOBAL_TEMP_FORM").html(this.$dropdown.find(".table"));
            //return $("#GLOBAL_TEMP_FORM").serializeJson();
            //return  this.$dropdown.children().html();
        },

        feedVal: function (trigger) {
            //this.$element.val(this.getVal());
            //if(trigger) {
            //    this.$element.trigger('cp:updated');
            //}
        },

        output: function (type) {
            var options = this.options;
            //var placeholders = this.placeholders;
            var $select = this['$' + type];
            var data = type === PROVINCE ? {} : [];
            var item;
            var districts;
            var code;
            var matched = null;
            var value;

            if (!$select || !$select.length) {
                return;
            }

            item = $select.data('item');

            value = (item ? item.address : null) || options[type];

            code = (
                type === PROVINCE ? 86 :
                    type === CITY ? this.$province && this.$province.find('.active').data('code') :
                        type === DISTRICT ? this.$city && this.$city.find('.active').data('code') : code
            );

            districts = $.isNumeric(code) ? ChineseDistricts[code] : null;

            if ($.isPlainObject(districts)) {
                $.each(districts, function (code, address) {
                    var provs;
                    if (type === PROVINCE) {
                        provs = [];
                        for (var i = 0; i < address.length; i++) {
                            if (address[i].address === value) {
                                matched = {
                                    code: address[i].code,
                                    address: address[i].address
                                };
                            }
                            provs.push({
                                code: address[i].code,
                                address: address[i].address,
                                selected: address[i].address === value
                            });
                        }
                        data[code] = provs;
                    } else {
                        if (address === value) {
                            matched = {
                                code: code,
                                address: address
                            };
                        }
                        data.push({
                            code: code,
                            address: address,
                            selected: address === value
                        });
                    }
                });
            }

            $select.html(type === PROVINCE ? this.getProvinceList(data) :
                this.getList(data, type));
            $select.data('item', matched);
        },

        getProvinceList: function (data) {
            var list = [],
                $this = this,
                simple = this.options.simple;

            $.each(data, function (i, n) {
                list.push('<dl class="clearfix">');
                list.push('<dt>' + i + '</dt><dd>');
                $.each(n, function (j, m) {
                    list.push(
                        '<a' +
                        ' title="' + (m.address || '') + '"' +
                        ' data-code="' + (m.code || '') + '"' +
                        ' class="' +
                        (m.selected ? ' active' : '') +
                        '">' +
                        ( simple ? $this.simplize(m.address, PROVINCE) : m.address) +
                        '</a>');
                });
                list.push('</dd></dl>');
            });

            return list.join('');
        },

        getList: function (data, type) {
            var list = [],
                $this = this,
                simple = this.options.simple;
            list.push('<dl class="clearfix"><dd>');

            $.each(data, function (i, n) {
                list.push(
                    '<a' +
                    ' title="' + (n.address || '') + '"' +
                    ' data-code="' + (n.code || '') + '"' +
                    ' class="' +
                    (n.selected ? ' active' : '') +
                    '">' +
                    ( simple ? $this.simplize(n.address, type) : n.address) +
                    '</a>');
            });
            list.push('</dd></dl>');

            return list.join('');
        },

        simplize: function (address, type) {
            address = address || '';
            if (type === PROVINCE) {
                return address.replace(/[省,市,自治区,壮族,回族,维吾尔]/g, '');
            } else if (type === CITY) {
                return address.replace(/[市,地区,回族,蒙古,苗族,白族,傣族,景颇族,藏族,彝族,壮族,傈僳族,布依族,侗族]/g, '')
                    .replace('哈萨克', '').replace('自治州', '').replace(/自治县/, '');
            } else if (type === DISTRICT) {
                return address.length > 2 ? address.replace(/[市,区,县,旗]/g, '') : address;
            }
        },

        tab: function (type) {

        },

        reset: function () {
            this.$element.val(null).trigger('change');
        },

        destroy: function () {
            this.unbind();
            this.$element.removeData(NAMESPACE).removeClass('city-picker-input');
            //this.$textspan.remove();
            this.$dropdown.remove();
        }
    };

    HelperPicker.DEFAULTS = {
        simple: false,
        responsive: true,
        placeholder: '请选择省/市/区',
        level: 'district',
        province: '',
        city: '',
        open:true,
        district: ''
    };

    HelperPicker.setDefaults = function (options) {
        $.extend(HelperPicker.DEFAULTS, options);
    };

    // Save the other helperpicker
    HelperPicker.other = $.fn.helperpicker;

    // Register as jQuery plugin
    $.fn.helperpicker = function (option) {

        var args = [].slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAMESPACE);
            var options;
            var fn;

            if (!data) {
                if (/destroy/.test(option)) {
                    return;
                }

                options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                $this.data(NAMESPACE, (data = new HelperPicker(this, options)));
            }

            if (typeof option === 'string' && $.isFunction(fn = data[option])) {
                fn.apply(data, args);
            }
        });
    };

    $.fn.helperpicker.Constructor = HelperPicker;
    $.fn.helperpicker.setDefaults = HelperPicker.setDefaults;

    // No conflict
    $.fn.helperpicker.noConflict = function () {
        $.fn.helperpicker = HelperPicker.other;
        return this;
    };

    $(function () {
        $('[data-toggle="helper-picker"]').helperpicker();
    });
});