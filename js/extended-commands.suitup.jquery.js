jQuery.extend( jQuery.suitUp.commands, {
	createlink: function( callback ){
		callback( window.prompt( 'This only creates link, to remove link use native "unlink" command or custom "link" command \nURL:', '' ) );
	},
	forecolor: 'red',
	insertimage: function( callback ){
		callback( window.prompt( 'URL:', '' ) );
	}
});

jQuery.extend( jQuery.suitUp.custom, {
	link: function( textarea, suitUpBlock ) {
		return jQuery( '<a/>' ).prop({
			className: 'suitup-control',
			href: '#'
		}).attr({
			'data-command': 'createlink' // adding same style as for createlink command button
		}).on( 'click', function() {
			if( !$.suitUp.hasSelectedNodeParent( 'a' ) ) {
				document.execCommand( 'createlink', false, window.prompt( 'This is custom "link" command \nURL:', '' ) );
			} else {
				document.execCommand( 'unlink', false, null );
			}
			
			textarea.value = $( suitUpBlock ).find( '.suitup-editor' ).html();
		});			
	},
	
	helloWorld: function() {
		return $( '<span/>', {
			'class': 'suitup-control'
		}).css( 'backgroundColor', 'red' ).on( 'click', function() {
			alert( 'Hello World!' );
		});
	}
});

/* 
//for tests:
jQuery.suitUp.controls = [ 
	'createlink',
	'justifycenter',
	'justifyfull',
	'justifyright',
	'justifyleft',
	'bold',
	'forecolor',
	'formatblock#<h1>',
	'formatblock#<h2>',
	'formatblock#<h3>',
	'formatblock#<h4>',
	'formatblock#<h5>',
	'formatblock#<h6>',
	'formatblock#<p>',
	'italic',
	'insertorderedlist',
	'insertunorderedlist',
	'strikethrough',
	'subscript',
	'superscript',
	'underline',
	'insertimage',
	'link',
	'helloWorld'
];
//*/