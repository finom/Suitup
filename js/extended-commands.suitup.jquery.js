jQuery.extend( jQuery.suitUp.commands, {
	createlink: function( callback ){
		callback( window.prompt( 'This only creates link, to remove link use native "unlink" command or custom "link" command \nURL:', '' ) );
	},
	justifycenter: null,
	justifyfull: null,
	justifyright: null,
	justifyleft: null,
	bold: null,
	forecolor: 'red',
	//formatBlock: null, // value is taken from string like 'formatBlock#BLOCKQUOTE' > 'BLOCKQUOTE',
	italic: null,
	insertorderedlist: null,
	insertunorderedlist: null,
	strikethrough: null,
	subscript: null,
	superscript: null,
	underline: null,
	insertimage: function( callback ){
		callback( window.prompt( 'URL:', '' ) );
	},
	insertParagraph: null
});

jQuery.extend( jQuery.suitUp.custom, {
	link: function() {
		return jQuery._createElement( 'a', {
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

//* 
//examples:
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