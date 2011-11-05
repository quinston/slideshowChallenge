/* 
THIS NOTICE MUST REMAIN INTACT.

Copyright  2011 Quincy Lam aka Micro01 aka reikaze
E-mail: lklq@live.com

This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

$(document).ready( function() {
	"use strict";

	var currentImage = null; //this holds the current jquery object pointing to the current thumbnail <img>

	// given the jquery object thumbnail pointing to a <img>, set the current image to be shown
	function setBigImage(thumbnail) {
		currentImage = thumbnail;
		var thumbnailURI = thumbnail.attr('src');
 
		// Breakup of thumbnail URIs:
		//
		// AAAAAAAAAAAAAAAAAAAA/thumb/AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/image.jpg/123px-image.jpg
		//
		// where 123px is the thumbnail height. Removing /thumb/ and the /123px... gives us a URI to the fullsize image.
	
		//get the full size image's URI
		var fullImageURI = thumbnailURI.substr( 0, thumbnailURI.search(/thumb\//i) ) + thumbnailURI.substr( thumbnailURI.search(/thumb\//i) + 'thumb/'.length, thumbnailURI.search(/\/\d+px/i) -  thumbnailURI.search(/thumb\//i) - 'thumb/'.length );
		//put the full size image into the centre	
		$('#bigImage').attr('src',fullImageURI); 
	}
	
	//create a variable of the new element for easy access
	var darkness = $('<div id="darknessBox"><a id="closeText">Close</a><img id="bigImage"/><ul id="thumbStrip"></ul></div>');
	
	$('body').append(darkness);

	// make a dark translucent box
	darkness.css('background-color', 'rgba(51,51,51,0.8)');
	darkness.css('display', 'block'); 
	darkness.css('width', $(window).width());
	darkness.css('height', $(window).height());
	darkness.css('z-index', 999999999);
	darkness.css('overflow','visible');
	darkness.offset({top: 0, left: 0});

	// get a list of every thumbnail in the article
	// the second search condition is for some div's that hold multiple images
	var allImages = $('#bodyContent img.thumbimage, #bodyContent div.thumbimage img');


	// filmstrip of thumbnails for selection
	allImages.each(function() {
		var currentListItem = $('<li></li>');
		$('#thumbStrip').append(currentListItem);
		currentListItem.append($(this).clone());
	});
	//style the filmstrip
	$('#thumbStrip li').css('display','inline-block');
	$('#thumbStrip li').css('height','50%');
	$('#thumbStrip li').css('padding','0.2em 0.2em');
	$('#thumbStrip').css('overflow','scroll');
	$('#thumbStrip').css('position','absolute');
	$('#thumbStrip').css('top','82%');

	
	//keeps it smack dab in the viewport
	darkness.css('position', 'fixed');
	darkness.css('top',0);

	//the image frame
	//maximum size for the image frame
	$('#bigImage').css('height', '61%');
	$('#bigImage').css('display','block');
	$('#bigImage').css('position','relative');
	$('#bigImage').css('top','19%');
	$('#bigImage').css('margin','0 auto');

	//hide until called for
	darkness.hide();

	//disable the standard image magnify links
	$('div.magnify a').attr('href',''); 

	$('div.magnify a').click(function(e) { 
		e.preventDefault();

		var thumbnail = $(this).parents('.thumbinner').find('img.thumbimage');
		setBigImage(thumbnail);

		//everything is ready. showtime!
		darkness.fadeIn(100); 
		//disable outer scrollbar
		$('body').css('overflow','hidden'); 
		return false;
	});

	// automatically resize #darknessBox with the size of the viewport
	$(window).resize(function(e) {		
		darkness.css('width', $(window).width());
		darkness.css('height', $(window).height());
	});

	// close text. soon to be a nice green button.
	$('#closeText').css('color','white');
	$('#closeText').css('float','right');
	$('#closeText').click(function() {
		darkness.fadeOut(200);
		$('body').css('overflow','auto');
	});

	// change images with scroll
	$('#bigImage').scroll(function(e) {
		e.preventDefault();
		//find the index of the current thumbnail and increment it and check if it is out of bounds 
		var currentIndex = allImages.index(currentImage);
		currentImage = allImages.eq( (currentIndex + 1 >= allImages.length) ? 0 : currentIndex + 1 );
		setBigImage(currentImage);
		return false;
	});
}); //ends .ready

