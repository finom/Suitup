"use strict";
( function( win, doc, $ ) {
var create = function( tagName, props ) {
	return $( $.extend( doc.createElement( tagName ), props ) );
};

$.suitUp = {
	controls: [ 'italic', 'bold', '|', 'formatblock#<h1>', 'formatblock#<h2>', 'formatblock#<h3>', 'formatblock#<p>' , '|', 'fontname', 'link' ],
	
	commands: {
		createlink: function( callback ){
			callback( win.prompt( 'URL:', '' ) );
		},
		fontname: {
			Arial: 'arial',
			Times: 'times'
		}
	},
	
	custom: {
		link: function( textarea, suitUpBlock ) {
			return create( 'a', {
				className: 'suitup-control',
				href: '#'
			}).attr({
				'data-command': 'createlink' // adding same style as for createlink command button
			}).on( 'click', function() {
				if( !$.suitUp.hasSelectedNodeParent( 'a' ) ) {
					doc.execCommand( 'createlink', false, win.prompt( 'URL:', '' ) );
				} else {
					doc.execCommand( 'unlink', false, null );
				}
				
				textarea.value = $( suitUpBlock ).find( '.suitup-editor' ).html();
			});
			
		}
	},
	
	getSelection: function() {
		var range;
		if( win.getSelection ) {
			try {
				range = win.getSelection().getRangeAt( 0 );
			} catch(e) {}
		} else if(doc.selection) { 
			range = doc.selection.createRange();  
		}
		return range;
	},
	
	restoreSelection: function( range ) {
		var s;
		if ( range ) {
			if ( win.getSelection ) {
				s = win.getSelection();
				if ( s.rangeCount > 0 ) 
					s.removeAllRanges();
				s.addRange( range );
			} else if (doc.createRange) {
				win.getSelection().addRange( range );
			} else if ( doc.selection ) {
				range.select();
			}
		}
	},
	
	getSelectedNode: function() {
		if ( doc.selection ) {
			return doc.selection.createRange().parentElement();
		} else {
			var selection = win.getSelection();
			if ( selection.rangeCount > 0 ) {
				return selection.getRangeAt( 0 ).endContainer;
			}
		}
	},
	
	hasSelectedNodeParent: function( tagName ) {
		var node = this.getSelectedNode(),
			has = false;
		tagName = tagName.toUpperCase();
		while( node && node.tagName !== 'BODY' ) {
			if( node.tagName === tagName ) {
				has = true;
				break;
			}
			node = node.parentNode;
		}
		return has;
	}
};

$.fn.suitUp = function( controls ) {
	var suitUp = $.suitUp,
		lastSelectionRange,
		lastSelectionElement,
		commands = $.suitUp.commands,
		custom = $.suitUp.custom,
		getSelection = suitUp.getSelection,
		restoreSelection = suitUp.restoreSelection;
	
	controls = controls || $.suitUp.controls;
	
	controls = controls instanceof Array ? controls : Array.prototype.slice.call( arguments ); // IE changes the arguments object when one of the arguments is redefined
	
	return this.each( function() {
		var that = this,
			self = $( this ).hide(),
			buttonControls,
			selectControls,
			typeofCommandValue,
			commandValue,
			select,
			
			mainBlock = create( 'div', {
				className: 'suitup'
			}).width( self.width() ),
			
			controlsBlock = create( 'div', {
				className: 'suitup-controls'
			}).appendTo( mainBlock ),
			
			containerBlock = create( 'div', {
				className: 'suitup-editor',
				contentEditable: true
			}).keyup( function(){ 
				updateTextarea();
				highlightActiveControls();
			}).focus( function(){
				lastSelectionElement = this;
				//document.execCommand('styleWithCSS', null, false);
			}).mouseup( function(){
				highlightActiveControls();
			})
			.html( that.value )
			.height( self.height() )
			.appendTo( mainBlock ),
			
			updateTextarea = function() {
				that.value = containerBlock.html();
			},
			
			highlightActiveControls = function() {
				buttonControls = buttonControls || $( 'a.suitup-control', controlsBlock );
				buttonControls
				 .removeClass( 'active' )
				 .each( function(){
					var self = $( this ),
						command = self.data( 'command' ),
						value = self.data( 'value' );
						
					try {
						value = value ? value.replace( '<', '' ).replace( '>', '' ) : value; // for formatBlock
						doc.queryCommandValue( command ) === ( value || 'true' ) && self.addClass( 'active' );
					} catch( e ) {}
					try {
						doc.queryCommandState( command ) && self.addClass( 'active' );
					} catch( e ) {}
				});
				
				selectControls = selectControls || $( 'select.suitup-control', controlsBlock );
				selectControls.each( function(){
					var self = $( this ),
						command = self.data( 'command' ),
						value = doc.queryCommandValue( command ),
						option = self.children( 'option' ).filter( function() {
							return value && this.value.toLowerCase() === value.toLowerCase();
						});
						
					if( option.length ) {
						this.value = option.val();
					}
				});
			}
			
		for( var splittedControl, i = 0, control = controls[ 0 ]; i < controls.length; control = controls[ ++i ] ) {
			splittedControl = control.split( '#' );
			control = splittedControl[ 0 ];
			commandValue = splittedControl[ 1 ];
			
			if( control === '|' ) {
				create( 'span', {
					className: 'suitup-separator'
				}).appendTo( controlsBlock );
				
			} else if( control in custom ) {
				custom[ control ]( that, mainBlock[ 0 ] ).appendTo( controlsBlock );
			} else {
				commandValue = commandValue || commands[ control ] || null;
				typeofCommandValue = typeof commandValue;
				
				if( commandValue && typeofCommandValue === 'object' ) {
					select = create( 'select', {
						className: 'suitup-control'
					})
					.attr( 'data-command', control )
					.appendTo( controlsBlock )
					.on( 'change', { command: control }, function( event ) {
						var command = event.data.command;
						doc.execCommand( command, null, this.value );
						updateTextarea();
					});
					
					$.each( commandValue, function( displayName, commandValue ) {
						create( 'option', {
							value: commandValue
						}).html( displayName )
						.appendTo( select );
					});
				} else {
					create( 'a', {
						href: '#',
						className: 'suitup-control'
					})
					.attr({
						'data-command': control,
						'data-value': typeofCommandValue === 'function' ? '_DYNAMIC_' : commandValue
					})
					.appendTo( controlsBlock )
					.on( 'click', { command: control, value: commandValue, typeofValue: typeofCommandValue }, function( event ){
						var command = event.data.command,
							value = event.data.value,
							typeofValue = event.data.typeofValue,
							resultValue;
						
						if( lastSelectionElement !== containerBlock[ 0 ] || !lastSelectionRange ) {
							containerBlock.focus();
						}
						
						if( typeofValue === 'function' ) {
							lastSelectionRange = getSelection();
							value( function( resultValue ) {
								lastSelectionElement.focus();
								restoreSelection( lastSelectionRange );
								doc.execCommand( command, null, resultValue );
								updateTextarea();
							});
						} else {
							resultValue = value;
							doc.execCommand( command, null, resultValue );
							updateTextarea();
							highlightActiveControls();
						}
						
						return false;
					});
				}
				
			} 
		}
			
		mainBlock.insertBefore( that );
		
	});
};
})( window, document, jQuery );