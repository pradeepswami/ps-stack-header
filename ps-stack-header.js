(function($) {
  'use strict';

  var mod = angular.module('psStack');
  mod.directive('psStackHeader', function(){
    return {
        restrict: 'A',
        scope : {
          topOffset: '@'
        },
        controller: function($scope){
          this._id = 0;
          this.generateId = function(prefix){
            var pre = prefix ? prefix : 'stack-item-';
            return pre + (++this._id);
          };
          console.log('ctrl');
          $scope.topOffset = 0;
        },
        link: function(scope, ele, attr){
            console.log('main');
            var isHdrFixed = function($ele){
              return ($ele.css('position') === 'fixed');
            }

            var addPlaceholder = function($element){
              var placeholder;
              if( $element.prop('tagName').toUpperCase() === 'TR' ||
                  $element.prop('tagName').toUpperCase() === 'THEAD' ){
                  placeholder =  $('<tr></tr>').height($element.height())

              } else {
                  var placeholder = $('<div></div>').height($element.height());
              }

              placeholder.attr('id', $element.data('stack-hdr-ele-id'));
              $element.after(placeholder)
            }

            var removePlaceholder = function($element){
              $element.next("#" + $element.data('stack-hdr-ele-id')).remove();
            }

            var pinElement = function($element){
              $element.css('position', 'fixed');
              $element.css('top', scope.topOffset);
              addPlaceholder($element);
              $('.last-header').removeClass('last-header');
              $element.addClass('stacked-item last-header');
            }

            var unpinElement = function($element){
              $element.removeClass('stacked-item last-header');
              $element.css('position', 'static');
              removePlaceholder($element);
              $('.stacked-item').last().addClass('last-header');
            }

            var checkAndUpdate = function($element){
              //var idStr = $element.attr('id');
              var top =  $element.offset().top;
              var scrollPosition = $(window).scrollTop();
              var triggerPoisition = top - scope.topOffset;

//              console.log(idStr + 'trigger ' + (top - scope.topOffset) + ' offset' + scope.topOffset);
              if( !isHdrFixed($element) && (scrollPosition > triggerPoisition)){
                  $element.data('stack-hdr-trigger-position', triggerPoisition);
                  pinElement($element);
                  //setting for next hdr
                  scope.topOffset = scope.topOffset + $element.data('stack-hdr-height');

              } else if( isHdrFixed($element) && scrollPosition < $element.data('stack-hdr-trigger-position')){
                  unpinElement($element);
                  scope.topOffset = scope.topOffset - $element.data('stack-hdr-height');
              }
            };

            $(window).on('scroll', function(){
              $('.serial-hdr').each(function(){
                checkAndUpdate($(this));
              });
            });
        }
    }
  });

  mod.directive('stackable', function(){
    return {
        restrict: 'A',
        require: '^stackHeader',
        link: function(scope, ele, attr, stackHeader){
          console.log('sub');
          var $ele = $(ele);
          $ele.addClass('serial-hdr');
          $ele.data('stack-hdr-offset-top', $ele.offset().top);
          $ele.data('stack-hdr-height', $ele.height());
          //check id
          $ele.data('stack-hdr-ele-id', stackHeader.generateId());
        }
      }
  });
})(jQuery);
